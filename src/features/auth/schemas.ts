import { z } from "zod";

/**
 * Схемы форм авторизации — единственное место, где описано,
 * что такое «данные входа» и «данные регистрации».
 * Типы выводятся отсюда же через z.infer, разъехаться они не могут.
 */

const REQUIRED = "Обязательное поле";

export const loginSchema = z.object({
  // При входе проверяем только заполненность: требования к длине
  // и составу пароля могли быть другими, когда аккаунт создавался.
  login: z.string().min(1, { message: REQUIRED }),
  password: z.string().min(1, { message: REQUIRED }),
});

export type LoginForm = z.infer<typeof loginSchema>;

/** Маска телефона из TextInput: +7(___)-___-__-__ */
const PHONE_PATTERN = /^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/;

/**
 * Порядок проверок важен: первой идёт заполненность. Форма показывает
 * первую ошибку поля, поэтому у пустого поля всегда «Обязательное поле»,
 * а не «Некорректный email» или «Минимум 8 символов».
 *
 * .trim() стоит перед проверками: строка из одних пробелов
 * превращается в пустую и не проходит как имя. Значение после trim
 * и уйдёт на сервер — форма отправляет результат разбора схемы.
 */
const requiredText = (max: number) =>
  z
    .string()
    .trim()
    .min(1, { message: REQUIRED })
    .max(max, { message: `Не длиннее ${max} символов` });

export const registerSchema = z
  .object({
    name: requiredText(50),
    surname: requiredText(50),
    // Отчество есть не у всех — пустая строка допустима.
    patronymic: z
      .string()
      .trim()
      .max(50, { message: "Не длиннее 50 символов" }),
    phone: z
      .string()
      .min(1, { message: REQUIRED })
      .regex(PHONE_PATTERN, { message: "Введите телефон полностью" }),
    // pipe: формат email проверяется, только если поле заполнено
    // и не слишком длинное, — иначе пустое поле получило бы две ошибки.
    email: requiredText(254).pipe(z.email({ message: "Некорректный email" })),
    login: requiredText(32)
      .min(3, { message: "Минимум 3 символа" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Только латиница, цифры и знак подчёркивания",
      }),
    // Пароль не обрезаем: пробелы в нём — часть пароля.
    password: z
      .string()
      .min(1, { message: REQUIRED })
      .min(8, { message: "Минимум 8 символов" })
      // bcrypt учитывает только первые 72 байта — длиннее смысла нет
      .max(72, { message: "Не длиннее 72 символов" })
      .regex(/\d/, { message: "Нужна хотя бы одна цифра" }),
    passwordRepeat: z.string().min(1, { message: REQUIRED }),
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: "Пароли не совпадают",
    // без path ошибка повисла бы на всей форме и пользователь её не увидел
    path: ["passwordRepeat"],
  });

/** То, что пользователь вводит в форму. */
export type RegisterFormInput = z.input<typeof registerSchema>;
/** То, что получается после разбора схемы: строки уже обрезаны. */
export type RegisterForm = z.infer<typeof registerSchema>;
