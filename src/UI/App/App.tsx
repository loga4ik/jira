import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "../HOC/Layout";
import { GuestRoute } from "../HOC/GuestRoute";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import Main from "../Pages/Main/Main";
import Project from "../Pages/project/Project";
import NotFound from "../Pages/404/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />
          <Route path="/project" element={<Project />} />
          <Route path='*' element={<NotFound />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
