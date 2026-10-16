import { skipToken } from "@reduxjs/toolkit/query/react";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import {
  useAddMemberMutation,
  useGetFreeUsersQuery,
  useGetProjectQuery,
  useGetTeamQuery,
  useRemoveMemberMutation,
} from "../../../../../Lib/api/projectApi";
import { getErrorMessage } from "../../../../../Lib/api/getErrorMessage";
import { useProjectId } from "../../../../../Hooks/useProjectId";

const AddUser = () => {
  const projectId = useProjectId();
  const arg = projectId ?? skipToken;

  const { data: project } = useGetProjectQuery(arg);
  const { data: team = [] } = useGetTeamQuery(arg);
  const { data: freeUsers = [] } = useGetFreeUsersQuery(arg);

  // Списки руками не правим: мутации сбрасывают тег Team/<id>,
  // и команда со свободными пользователями перезапрашиваются сами.
  const [addMember, addState] = useAddMemberMutation();
  const [removeMember, removeState] = useRemoveMemberMutation();
  const isBusy = addState.isLoading || removeState.isLoading;
  const error = getErrorMessage(addState.error ?? removeState.error);

  const add = (userId: number) => {
    if (projectId) addMember({ projectId, userId });
  };
  const remove = (userId: number) => {
    if (projectId) removeMember({ projectId, userId });
  };

  return (
    <div className="text-white">
      {error && (
        <p role="alert" className="p-3 text-red-400">
          {error}
        </p>
      )}
      <div className="p-4">
        <p>Уже на проекте:</p>
        {team
          .filter((user) => user.id !== project?.owner_id)
          .map((user) => (
            <div className="flex items-center" key={user.id}>
              <p>
                имя: {user.name} логин: {user.login}
              </p>
              <Button
                title={`удалить ${user.login}`}
                type="button"
                className="h-10 border-transparent"
                changableIconClass="bin"
                shadow={false}
                disabled={isBusy}
                onClick={() => remove(user.id)}
              />
            </div>
          ))}
      </div>
      <hr />
      <div className="p-4">
        <p>Добавить:</p>
        {freeUsers.map((user) => (
          <div className="flex items-center" key={user.id}>
            <p>
              имя: {user.name} логин: {user.login}
            </p>
            <Button
              title={`добавить ${user.login}`}
              type="button"
              className="h-10 border-transparent"
              changableIconClass="add"
              shadow={false}
              disabled={isBusy}
              onClick={() => add(user.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddUser;
