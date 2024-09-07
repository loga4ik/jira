import { Wrapper } from "../../../../../UIKit/Wrapper";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import "./Sidebar.css";
import { useState } from "react";
import Modal from "../../../../../UIKit/Modal/Modal";
import AddUser from "../AddUser/AddUser";

type OpenedElement = "edit" | "delete" | "add_user" | undefined;

const Sidebar = () => {
  const [openElement, setOpenElement] = useState<OpenedElement>();

  const buttonClickHandler = (name: OpenedElement) => {
    setOpenElement(name);
  };

  const closeModal = () => {
    setOpenElement(undefined);
  };

  return (
    <Wrapper className="py-8 flex flex-col flex-none w-20 rounded-full">
      <Button
        type="button"
        changableIconClass="user_add"
        defaultMP={false}
        className="h-12 w-12 mb-5 border place-self-center"
        onClick={() => buttonClickHandler("add_user")}
      />
      <Button
        type="button"
        changableIconClass="bin"
        defaultMP={false}
        className="h-12 w-12 mb-5 border place-self-center"
        onClick={() => buttonClickHandler("delete")}
      />
      <Button
        type="button"
        changableIconClass="user_add"
        defaultMP={false}
        className="h-12 w-12 mb-5 border place-self-center"
        onClick={() => buttonClickHandler("edit")}
      />
      {openElement && (
        <Modal closeModal={closeModal}>
          {openElement === "add_user" && <AddUser />}
          {openElement === "delete" && <div>delete</div>}
          {openElement === "edit" && <div>edit</div>}
        </Modal>
      )}
    </Wrapper>
  );
};

export default Sidebar;
