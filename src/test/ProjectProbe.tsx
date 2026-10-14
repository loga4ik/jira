import { useParams } from "react-router-dom";

/** Заглушка страницы проекта: показывает, на какой проект перешли. */
export const ProjectProbe = () => <p>Проект {useParams().id}</p>;
