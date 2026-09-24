import { z } from "zod";

/**
 * Схемы форм авторизации — единственное место, где описано,
 * что такое «данные входа» и «данные регистрации».
 * Типы выводятся отсюда же через z.infer, разъехаться они не могут.
 */

export const loginSchema = z.object({
  // При входе проверяем только заполненность: требования к длине
  // и составу пароля могли быть другими, когда аккаунт создавался.
  login: z.string().min(1, { message: "Обязательное поле" }),
  password: z.string().min(1, { message: "Обязательное поле" }),
});

export type LoginForm = z.infer<typeof loginSchema>;

/** Маска телефона из TextInput: +7(___)-___-__-__ */
const PHONE_PATTERN = /^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/;

export const registerSchema = z
  .object({
    name: z.string().min(1, { message: "Обязательное поле" }),
    surname: z.string().min(1, { message: "Обязательное поле" }),
    // Отчество есть не у всех — пустая строка допустима.
    patronymic: z.string(),
    phone: z
      .string()
      .regex(PHONE_PATTERN, { message: "Введите телефон полностью" }),
    email: z.email({ message: "Некорректный email" }),
    login: z
      .string()
      .min(3, { message: "Минимум 3 символа" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Только латиница, цифры и знак подчёркивания",
      }),
    password: z
      .string()
      .min(8, { message: "Минимум 8 символов" })
      .regex(/\d/, { message: "Нужна хотя бы одна цифра" }),
    passwordRepeat: z.string().min(1, { message: "Обязательное поле" }),
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: "Пароли не совпадают",
    // без path ошибка повисла бы на всей форме и пользователь её не увидел
    path: ["passwordRepeat"],
  });

export type RegisterForm = z.infer<typeof registerSchema>;
