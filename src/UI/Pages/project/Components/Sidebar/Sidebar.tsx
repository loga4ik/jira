import { Wrapper } from "../../../../../UIKit/Wrapper";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import "./Sidebar.css";
import { useEffect, useState } from "react";
import Modal from "../../../../../UIKit/Modal/Modal";
import AddUser from "../AddUser/AddUser";
import EditProject from "../EditProject/EditProject";

type OpenedElement = "edit" | "delete" | "add_user" | false;

const Sidebar = () => {
  const [openElement, setOpenElement] = useState<OpenedElement>();

  const buttonClickHandler = (name: OpenedElement) => {
    setOpenElement(name);
  };

  const closeModal = () => {
    console.log("closeModal");
    
    setOpenElement(false);
  };
  
  useEffect(() => {
    console.log(openElement);
  }, []);

  return (
    <Wrapper className="py-8 flex flex-col flex-none w-20 rounded-full">
      <Button
        type="button"
        changableIconClass="user_add"
        defaultMP={false}
        className="h-12 w-12 mb-5  place-self-center"
        onClick={() => buttonClickHandler("add_user")}
      />
      <Button
        type="button"
        changableIconClass="bin"
        defaultMP={false}
        className="h-12 w-12 mb-5  place-self-center"
        onClick={() => buttonClickHandler("delete")}
      />
      <Button
        type="button"
        changableIconClass="edit"
        defaultMP={false}
        className="h-12 w-12 mb-5  place-self-center"
        onClick={() => buttonClickHandler("edit")}
      />
      {openElement && (
        <Modal closeModal={closeModal}>
          {openElement === "add_user" && <AddUser />}
          {openElement === "delete" && <div>delete</div>}
          {openElement === "edit" && <EditProject closeModal={closeModal} />}
        </Modal>
      )}
    </Wrapper>
  );
};

export default Sidebar;
