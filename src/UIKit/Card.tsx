import React from "react";
import { useNavigate } from "react-router-dom";
import { Wrapper } from "./Wrapper";

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
    <Wrapper
      className="grid grid-cols-6 rounded-lg max-w-xl
    w-full mb-5 cursor-pointer"
      onClick={redirectClickHandler}
    >
      <img
        className="w-20 h-full rounded-l-lg p-3 ml-3"
        src={"../public/img/noIco.svg"}
        alt="иконка проекта"
      />
      <div className="p-4 col-start-2 col-end-8">
        <h5
          className="mb-2 text-2xl font-bold tracking-tight
        text-gray-600"
        >
          {title}
        </h5>
        <p className="mb-3 font-normal text-gray-400 max-w-96">{description}</p>
      </div>
    </Wrapper>
  );
};

export default Card;
