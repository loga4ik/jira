import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();

  return (
    <>
      <div>Main</div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </>
  );
};

export default Main;
