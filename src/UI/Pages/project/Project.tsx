import React from "react";
import { useLocation } from "react-router-dom";
import { CardData } from "../../../UIKit/Card";

const Project = () => {
  const location = useLocation();
  const state = location.state as CardData; // Приведение типа для использования state

  return (
    <div>
      <p>{state.img}</p>
      <p>{state.title}</p>
      <p>{state.description}</p>
    </div>
  );
};

export default Project;
