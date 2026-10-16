import { useMatch } from "react-router-dom";

/**
 * id проекта из адреса /project/:id или undefined, если мы не на странице
 * проекта или в адресе мусор. useMatch, а не useParams: так хук работает
 * и вне маршрута проекта — например, в шапке (Layout), которая показывает команду.
 */
export const useProjectId = (): number | undefined => {
  const match = useMatch("/project/:id");
  const id = Number(match?.params.id);
  return Number.isInteger(id) && id > 0 ? id : undefined;
};
