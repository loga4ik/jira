import { beforeEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import { server } from "../../../test/server";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { ivan } from "../../../test/fixtures";
import { setAccessToken } from "../../../Lib/api/authToken";
import Register from "./Register";

/*
 * Здесь у полей есть <label>, поэтому ищем их так, как их найдёт
 * скринридер, — по подписи (getByLabelText). Если подпись пропадёт
 * или перестанет быть связана с полем, тест упадёт: доступность
 * проверяется заодно с поведением.
 */
const field = (label: string) => screen.getByLabelText(label);

const renderRegister = () =>
  renderWithProviders(<Register />, { route: "/register", path: "/register" });

type User = ReturnType<typeof renderRegister>["user"];

/** Заполняет форму корректными данными; overrides меняют отдельные поля. */
const fillForm = async (user: User, overrides: Record<string, string> = {}) => {
  const values: Record<string, string> = {
    Имя: "Иван",
    Фамилия: "Иванов",
    Телефон: "9001234567",
    Email: "ivan@example.com",
    Логин: "ivan",
    Пароль: "secret123",
    "Повтор пароля": "secret123",
    ...overrides,
  };
  for (const [label, value] of Object.entries(values)) {
    if (value) await user.type(field(label), value);
  }
};

const submit = (user: User) =>
  user.click(screen.getByRole("button", { name: "зарегистрироваться" }));

beforeEach(() => {
  setAccessToken(null);
});

describe("Register", () => {
  it("пустая форма: «Обязательное поле» у всех полей, кроме отчества", async () => {
    let createCalls = 0;
    server.use(
      http.post("/api/user/create", () => {
        createCalls++;
        return HttpResponse.json({ accessToken: "a", user: ivan });
      }),
    );

    const { user } = renderRegister();
    await submit(user);

    // 7 обязательных полей — и у каждого один и тот же текст,
    // а не «Некорректный email» или «Минимум 8 символов».
    expect(await screen.findAllByText("Обязательное поле")).toHaveLength(7);
    expect(field("Отчество, необязательно")).not.toHaveAttribute(
      "aria-invalid",
    );
    expect(createCalls).toBe(0);
  });

  it("ошибка связана с полем: aria-invalid и aria-describedby", async () => {
    const { user } = renderRegister();
    await submit(user);

    // toHaveAccessibleDescription читает текст элемента, на который
    // указывает aria-describedby, — так же, как скринридер.
    const email = field("Email");
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription("Обязательное поле");
  });

  it("имя из одних пробелов не принимается", async () => {
    const { user } = renderRegister();

    await user.type(field("Имя"), "   ");
    await user.tab(); // уходим с поля — форма проверяет его по blur

    expect(await screen.findByText("Обязательное поле")).toBeInTheDocument();
    expect(field("Имя")).toHaveAttribute("aria-invalid", "true");
  });

  it("смена пароля перепроверяет повтор", async () => {
    const { user } = renderRegister();

    await user.type(field("Пароль"), "secret123");
    await user.type(field("Повтор пароля"), "secret123");
    await user.tab();
    expect(screen.queryByText("Пароли не совпадают")).not.toBeInTheDocument();

    // Меняем сам пароль — повтор теперь не совпадает,
    // и ошибка должна появиться сразу, а не после отправки.
    await user.type(field("Пароль"), "4");
    await user.tab();

    expect(await screen.findByText("Пароли не совпадают")).toBeInTheDocument();
  });

  it.each([
    { typed: "89001234567", case: "набран с 8" },
    { typed: "79001234567", case: "набран с 7" },
    { typed: "9001234567", case: "набран без кода страны" },
  ])("телефон $case → +7(900)-123-45-67", async ({ typed }) => {
    const { user } = renderRegister();

    await user.type(field("Телефон"), typed);
    // Уходим с поля: библиотека маски, пока поле в фокусе, держит таймер
    // и снимает его только по blur. Иначе таймер сработал бы уже после
    // конца теста, когда jsdom разобран, — «window is not defined».
    await user.tab();

    expect(field("Телефон")).toHaveValue("+7(900)-123-45-67");
  });

  it("у отчества пометка «необязательно», звёздочек нет", () => {
    renderRegister();

    expect(
      screen.getByPlaceholderText("отчество (необязательно)"),
    ).toBeInTheDocument();
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("отправляет обрезанные данные без passwordRepeat и переходит на главную", async () => {
    let sentBody: unknown;
    server.use(
      http.post("/api/user/create", async ({ request }) => {
        sentBody = await request.json();
        return HttpResponse.json({ accessToken: "access-1", user: ivan });
      }),
    );

    const { user } = renderRegister();
    await fillForm(user, { Имя: "  Иван  " });
    await submit(user);

    expect(await screen.findByText("Главная страница")).toBeInTheDocument();
    expect(sentBody).toEqual({
      name: "Иван",
      surname: "Иванов",
      patronymic: "",
      phone: "+7(900)-123-45-67",
      email: "ivan@example.com",
      login: "ivan",
      password: "secret123",
    });
  });

  it("занятый логин: понятная ошибка, остаёмся на странице", async () => {
    server.use(
      http.post("/api/user/create", () =>
        HttpResponse.json({ message: "conflict" }, { status: 409 }),
      ),
    );

    const { user } = renderRegister();
    await fillForm(user);
    await submit(user);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Этот логин уже занят",
    );
    expect(screen.queryByText("Главная страница")).not.toBeInTheDocument();
  });

  it("пока идёт запрос, кнопка заблокирована", async () => {
    server.use(
      http.post("/api/user/create", async () => {
        await delay(100);
        return HttpResponse.json({ accessToken: "access-1", user: ivan });
      }),
    );

    const { user } = renderRegister();
    await fillForm(user);
    await submit(user);

    expect(
      screen.getByRole("button", { name: "создаём аккаунт…" }),
    ).toBeDisabled();
    expect(await screen.findByText("Главная страница")).toBeInTheDocument();
  });
});
