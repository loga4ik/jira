import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "../HOC/Layout";
import { GuestRoute } from "../HOC/GuestRoute";

/*
 * Страницы грузятся лениво: import() с круглыми скобками — сигнал сборщику
 * вынести страницу в отдельный файл, а lazy скачивает его при первом показе.
 * Так форма входа не тянет за собой код проектов, задач и чата.
 *
 * Пока файл страницы качается, показывается fallback из <Suspense>
 * в Layout — шапка при этом остаётся на месте.
 *
 * lazy работает только с export default — у всех страниц он есть.
 */
const Main = lazy(() => import("../Pages/Main/Main"));
const Login = lazy(() => import("../Pages/Login/Login"));
const Register = lazy(() => import("../Pages/Register/Register"));
const Project = lazy(() => import("../Pages/project/Project"));
const NotFound = lazy(() => import("../Pages/404/NotFound"));

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
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
