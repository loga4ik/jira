/**
 * Access-токен живёт только в памяти вкладки — не в localStorage и не в Redux.
 * localStorage читает любой скрипт на странице, и при XSS токен утёк бы.
 * В Redux он светился бы в devtools, хотя ни один компонент не должен
 * перерисовываться от его смены. После перезагрузки страницы токена нет —
 * его восстанавливает refreshAccessToken по httpOnly-куке.
 */
let accessToken: string | null = null;

export const getAccessToken = () => accessToken;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

type RefreshResponse = { accessToken: string };

let refreshInFlight: Promise<boolean> | null = null;

/**
 * Обновляет access-токен по refresh-куке. Возвращает true, если получилось.
 *
 * Пока обновление идёт, повторные вызовы получают тот же промис: пять запросов,
 * одновременно получивших 401, вызовут один /refresh, а не пять. Иначе каждый
 * из них прокрутил бы ротацию и наплодил лишних токенов в базе.
 */
export const refreshAccessToken = (): Promise<boolean> => {
  if (!refreshInFlight) {
    refreshInFlight = fetch("/api/user/refresh", {
      method: "POST",
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) {
          setAccessToken(null);
          return false;
        }
        const data = (await response.json()) as RefreshResponse;
        setAccessToken(data.accessToken);
        return true;
      })
      .catch(() => {
        setAccessToken(null);
        return false;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
};
