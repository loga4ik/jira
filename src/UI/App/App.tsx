import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "../HOC/Layout";
import { GuestRoute } from "../HOC/GuestRoute";
import { ProtectedRoute } from "../HOC/ProtectedRoute";

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
          {/* только для вошедших: гостя уведёт на /login?from=… */}
          <Route element={<ProtectedRoute />}>
            <Route index element={<Main />} />
            <Route path="/project/:id" element={<Project />} />
          </Route>
          {/* только для гостей: вошедшего уведёт туда, куда он шёл */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          {/* 404 видна всем — гостю незачем логиниться, чтобы узнать,
              что страницы нет */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
