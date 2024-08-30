import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "../HOC/Layout";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import Main from "../Pages/Main/Main";
import Project from "../Pages/project/Project";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/project" element={<Project />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
