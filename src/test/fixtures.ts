import type { AuthUser } from "../Lib/api/userApi";

/** Пользователь, которого «возвращает сервер» в тестах. */
export const ivan: AuthUser = {
  id: 1,
  login: "ivan",
  name: "Иван",
  surname: "Иванов",
  patronymic: "",
  phone: "+7(900)-000-00-00",
  email: "ivan@example.com",
};
