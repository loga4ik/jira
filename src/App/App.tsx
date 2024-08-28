import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Layout } from "../HOC/Layout";
import Main from "../Pages/Main";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
