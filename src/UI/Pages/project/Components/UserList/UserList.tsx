import { skipToken } from "@reduxjs/toolkit/query/react";
import {
  useGetProjectQuery,
  useGetTeamQuery,
} from "../../../../../Lib/api/projectApi";
import { useProjectId } from "../../../../../Hooks/useProjectId";

/** Команда проекта в шапке. Шапка (Layout) — вне страницы проекта, поэтому id из адреса. */
const UserList = () => {
  const projectId = useProjectId();
  // Команду спрашиваем только когда проект открылся — то есть доступ есть.
  // useGetProjectQuery здесь не делает второго запроса: страница уже
  // запросила проект, ответ возьмётся из кэша.
  const { isSuccess: hasAccess } = useGetProjectQuery(projectId ?? skipToken);
  const { data: team = [] } = useGetTeamQuery(
    projectId && hasAccess ? projectId : skipToken
  );

  if (team.length === 0) return null;

  return (
    <div className="flex items-center">
      <p className="mr-2">команда:</p>
      <div className="flex">
        {team.map((user) => (
          <p
            key={`${user.id}_user-item`}
            className="border-2 rounded-lg mr-2 py px-3 border-gray-400 h-fit"
          >
            {user.login}
          </p>
        ))}
      </div>
    </div>
  );
};

export default UserList;
