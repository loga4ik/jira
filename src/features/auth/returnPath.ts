/**
 * Куда вернуть пользователя после входа.
 *
 * Гость открывает ссылку на проект → его отправляют на /login?from=/project/5 →
 * после входа он попадает обратно на /project/5, а не на главную.
 */

/** Адрес страницы входа с запомненным путём возврата. */
export const loginPathWithReturn = (location: {
  pathname: string;
  search: string;
}): string => {
  const path = location.pathname + location.search;
  // с главной возвращать некуда — после входа и так попадём туда
  if (path === "/") return "/login";
  return `/login?from=${encodeURIComponent(path)}`;
};

/**
 * Путь возврата из ?from=…, только если он внутренний.
 *
 * Без проверки ссылка вида /login?from=//evil.com после входа увела бы
 * пользователя на чужой сайт (open redirect): «//» браузер считает
 * адресом другого домена, «/\» — тоже.
 */
export const getSafeReturnPath = (search: string): string | null => {
  const from = new URLSearchParams(search).get("from");
  if (!from || !from.startsWith("/")) return null;
  if (from.startsWith("//") || from.startsWith("/\\")) return null;
  return from;
};
