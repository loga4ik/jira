import { beforeEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import { server } from "../../../test/server";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { ivan } from "../../../test/fixtures";
import { getAccessToken, setAccessToken } from "../../../Lib/api/userApi/authToken";
import Login from "./Login";
import { setMainProject } from "../../../features/mainProject/mainProject";

/*
 * Здесь тестируем форму глазами пользователя: он не знает про
 * useForm, zod и RTK Query — он видит поля, кнопку и тексты.
 * Поэтому и ищем элементы так, как их нашёл бы человек:
 * по роли и подписи (getByRole), по плейсхолдеру, по тексту.
 * Тогда тест не сломается от переименования класса или
 * переноса логики в другой хук — только от изменения поведения.
 *
 * getBy…  — элемент должен быть прямо сейчас, иначе ошибка;
 * queryBy… — вернёт null, если нет (для проверки «не показано»);
 * findBy… — подождёт появления (для того, что приходит после запроса).
 */

// Поля и кнопка — одни и те же во всех тестах.
// Поля ищем по плейсхолдеру, а не по getByRole с именем: у них нет <label>
// и aria-label, поэтому доступного имени нет вовсе — скринридер прочитает
// просто «поле ввода». Плейсхолдер именем не считается. Когда в UI-ките
// появятся подписи (задача 11), здесь станет getByRole("textbox", { name: "Логин" }).
const loginInput = () => screen.getByPlaceholderText("логин");
const passwordInput = () => screen.getByPlaceholderText("пароль");
const submitButton = () => screen.getByRole("button", { name: "войти" });

beforeEach(() => {
  setAccessToken(null);
  localStorage.clear();
});

describe("Login", () => {
  it("с пустыми полями показывает ошибки и не отправляет запрос", async () => {
    // Подготовка: считаем обращения к серверу — их быть не должно.
    let loginCalls = 0;
    server.use(
      http.post("/api/user/login", () => {
        loginCalls++;
        return HttpResponse.json({ accessToken: "a", user: ivan });
      }),
    );

    const { user } = renderWithProviders(<Login />);

    // Действие: сразу жмём «войти», ничего не заполнив.
    await user.click(submitButton());

    // Проверка: под каждым полем ошибка, запрос не ушёл.
    // findAllBy — ошибки появляются после асинхронной валидации zod.
    expect(await screen.findAllByText("Обязательное поле")).toHaveLength(2);
    expect(loginCalls).toBe(0);
  });

  it("при неверном пароле показывает понятную ошибку", async () => {
    server.use(
      http.post("/api/user/login", () =>
        HttpResponse.json({ message: "wrong password" }, { status: 401 }),
      ),
    );

    const { user } = renderWithProviders(<Login />);

    // user.type печатает посимвольно, с событиями клавиатуры —
    // как живой человек, а не подстановкой value.
    await user.type(loginInput(), "ivan");
    await user.type(passwordInput(), "wrong");
    await user.click(submitButton());

    // Текст с сервера («wrong password») пользователю не показываем:
    // для 401 форма подставляет свой — см. getErrorMessage в Login.tsx.
    expect(
      await screen.findByText("Неверный логин или пароль"),
    ).toBeInTheDocument();
    expect(screen.queryByText("wrong password")).not.toBeInTheDocument();
    // И пользователь остался на странице входа.
    expect(screen.queryByText("Главная страница")).not.toBeInTheDocument();
  });

  it("после успешного входа переводит на главную", async () => {
    // Запоминаем тело запроса, чтобы проверить, что форма отправила
    // именно то, что ввели. Проверяем ниже, а не внутри обработчика:
    // упавший там expect превратился бы в ответ 500, и тест упал бы
    // с непонятной ошибкой «не найдена главная страница».
    let sentBody: unknown;
    server.use(
      http.post("/api/user/login", async ({ request }) => {
        sentBody = await request.json();
        return HttpResponse.json({ accessToken: "access-1", user: ivan });
      }),
    );

    const { user } = renderWithProviders(<Login />);

    await user.type(loginInput(), "ivan");
    await user.type(passwordInput(), "secret1");
    await user.click(submitButton());

    expect(await screen.findByText("Главная страница")).toBeInTheDocument();
    expect(sentBody).toEqual({ login: "ivan", password: "secret1" });
    expect(getAccessToken()).toBe("access-1");
  });

  it("после входа возвращает туда, куда пользователь шёл (?from=)", async () => {
    server.use(
      http.post("/api/user/login", () =>
        HttpResponse.json({ accessToken: "access-1", user: ivan }),
      ),
    );

    const { user } = renderWithProviders(<Login />, {
      route: "/login?from=%2Fproject%2F5",
    });

    await user.type(loginInput(), "ivan");
    await user.type(passwordInput(), "secret1");
    await user.click(submitButton());

    expect(await screen.findByText("Проект 5")).toBeInTheDocument();
  });

  it("чужой адрес в ?from= игнорирует и ведёт на главную", async () => {
    server.use(
      http.post("/api/user/login", () =>
        HttpResponse.json({ accessToken: "access-1", user: ivan }),
      ),
    );

    const { user } = renderWithProviders(<Login />, {
      route: "/login?from=%2F%2Fevil.com",
    });

    await user.type(loginInput(), "ivan");
    await user.type(passwordInput(), "secret1");
    await user.click(submitButton());

    expect(await screen.findByText("Главная страница")).toBeInTheDocument();
  });

  it("после входа открывает главный проект, если он выбран", async () => {
    setMainProject(ivan.id, 7);
    server.use(
      http.post("/api/user/login", () =>
        HttpResponse.json({ accessToken: "access-1", user: ivan }),
      ),
    );

    const { user } = renderWithProviders(<Login />);

    await user.type(loginInput(), "ivan");
    await user.type(passwordInput(), "secret1");
    await user.click(submitButton());

    expect(await screen.findByText("Проект 7")).toBeInTheDocument();
  });

  it("?from= важнее главного проекта", async () => {
    setMainProject(ivan.id, 7);
    server.use(
      http.post("/api/user/login", () =>
        HttpResponse.json({ accessToken: "access-1", user: ivan }),
      ),
    );

    const { user } = renderWithProviders(<Login />, {
      route: "/login?from=%2Fproject%2F5",
    });

    await user.type(loginInput(), "ivan");
    await user.type(passwordInput(), "secret1");
    await user.click(submitButton());

    expect(await screen.findByText("Проект 5")).toBeInTheDocument();
  });

  it("пока идёт запрос, кнопка заблокирована и показывает «входим…»", async () => {
    // Сервер отвечает не сразу — иначе не успеть увидеть
    // промежуточное состояние.
    server.use(
      http.post("/api/user/login", async () => {
        await delay(100);
        return HttpResponse.json({ accessToken: "access-1", user: ivan });
      }),
    );

    const { user } = renderWithProviders(<Login />);

    await user.type(loginInput(), "ivan");
    await user.type(passwordInput(), "secret1");
    await user.click(submitButton());

    // Пока ответа нет: на кнопке «входим…», и она неактивна —
    // второй раз не нажать, дубль запроса не уйдёт.
    // Доступное имя кнопки берётся из её текста (title — только запасной
    // вариант), поэтому теперь она находится по имени «входим…».
    expect(screen.getByRole("button", { name: "входим…" })).toBeDisabled();

    // Дождались ответа — переход на главную.
    expect(await screen.findByText("Главная страница")).toBeInTheDocument();
  });
});
