import React from "react";
import { useNavigate } from "react-router-dom";

export type CardData = {
  title: string;
  description: string;
  img: string;
  id: number;
};

const Card: React.FC<CardData> = ({ title, description, img, id }) => {
  const data = {
    title: title,
    description: description,
    img: img,
    id: id,
  };

  const navigate = useNavigate();
  const redirectClickHandler = () => {
    navigate("/project", { state: data });
  };
  return (
    <div
      className="flex border
      border-gray-200 rounded-lg shadow max-w-xl bg-zinc-200
      hover:bg-gray-100 w-full mb-5 min-w-60 items-center"
      onClick={redirectClickHandler}
    >
      <img
        className="w-20 h-full rounded-l-lg p-3 ml-3"
        src={"../public/img/noIco.svg"}
        alt=""
      />
      <div className="p-4">
        <h5
          className="mb-2 text-2xl font-bold tracking-tight
        text-gray-600"
        >
          {title}
        </h5>
        <p className="mb-3 font-normal text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default Card;
