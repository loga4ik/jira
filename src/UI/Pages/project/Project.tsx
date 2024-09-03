import { useLocation } from "react-router-dom";
import { CardData } from "../../../UIKit/Card";
import { Button } from "../../../UIKit/Inputs/Button/Button";
import { Wrapper } from "../../../UIKit/Wrapper";
import { useEffect, useState } from "react";
import { getTeam } from "../../../Api/projectApi";
import { ProjectPai_UserRes } from "../../../Api/types";
import Chat from "./Components/Chat/Chat";

const Project = () => {
  const location = useLocation();
  const state = location.state as CardData; // Приведение типа для использования state
  const [userList, setUserList] = useState<ProjectPai_UserRes[]>();

  useEffect(() => {
    if (state.id) {
      getTeam(state.id)
        .then((teamData) => {
          if (!(teamData instanceof Error)) {
            setUserList(teamData);
          }
          console.log(teamData);
        })
        .catch((error) => {
          console.error("Error fetching team:", error);
        });
    }
  }, [state.id]);

  return (
    <div className="flex mx-4 my-8 ">
      {/* sidebar */}
      <Wrapper className="py-8 flex flex-col flex-none w-20 rounded-full">
        <Button type="button">ка</Button>
        <Button type="button">ка</Button>
        <Button type="button">ка</Button>
      </Wrapper>
      {/* mainBlock */}
      <Wrapper className="flex-1 ml-6 p-3 min-h-96 rounded-lg relative">
        {/* <p>{state.img}</p> */}
        <div className="flex border px-3 py-1 border-transparent border-b-slate-500">
          <p className="font-semibold text-xl mr-2 h-full">{state.title}</p>|
          <p className="font-normal text-xl ml-2 ">{state.description}</p>
          <p className="absolute right-5 font-semibold text-xl">
            {userList?.length}
          </p>
        </div>
        <div></div>
      </Wrapper>
      {/* <ChatIcon /> */}
      <Chat />
    </div>
  );
};

export default Project;
