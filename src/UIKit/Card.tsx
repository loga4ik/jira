import React from "react";
import { Link } from "react-router-dom";
import { Wrapper } from "./Wrapper";

export type CardData = {
  title: string;
  description: string;
  img: string;
  id: number;
  owner_id: number;
};

type CardProps = CardData & {
  /** Отмечен ли проект главным. */
  isMain?: boolean;
  /** Нет — кнопки «сделать главным» не будет. */
  onToggleMain?: () => void;
};

/**
 * Карточка проекта — обычная ссылка на /project/:id.
 * Раньше это был div с onClick и переходом через navigate(…, { state }),
 * поэтому не работали средняя кнопка мыши, Ctrl+клик, «открыть в новой
 * вкладке», копирование адреса и переход с клавиатуры.
 */
const Card: React.FC<CardProps> = ({
  title,
  description,
  id,
  isMain = false,
  onToggleMain,
}) => {
  return (
    // Кнопка — рядом со ссылкой, а не внутри: кнопка внутри <a>
    // запрещена HTML, и клик по ней заодно открывал бы проект.
    <div className="relative max-w-xl w-full mb-5">
      <Link
        to={`/project/${id}`}
        className="block w-full rounded-lg focus:outline-none focus-visible:ring"
      >
        <Wrapper className="grid grid-cols-6 rounded-lg w-full">
          <img
            className="w-20 h-full rounded-l-lg p-3 ml-3"
            src={"../public/img/noIco.svg"}
            alt=""
          />
          <div className="p-4 col-start-2 col-end-8">
            <h5
              className="mb-2 text-2xl font-bold tracking-tight
        text-gray-600"
            >
              {title}
            </h5>
            <p className="mb-3 font-normal text-gray-400 max-w-96">
              {description}
            </p>
          </div>
        </Wrapper>
      </Link>
      {onToggleMain && (
        <button
          type="button"
          onClick={onToggleMain}
          aria-pressed={isMain}
          aria-label={
            isMain
              ? `Убрать «${title}» из главных`
              : `Сделать «${title}» главным`
          }
          title={isMain ? "главный проект" : "сделать главным"}
          className={`absolute top-2 right-3 text-2xl leading-none rounded focus:outline-none focus-visible:ring ${
            isMain ? "text-yellow-400" : "text-gray-400 hover:text-yellow-300"
          }`}
        >
          {isMain ? "★" : "☆"}
        </button>
      )}
    </div>
  );
};

export default Card;
