/**
 * «Главный проект» — выбор хранится в браузере, а не на сервере.
 * Ключ с id пользователя: на одном компьютере у двух людей
 * будут свои главные проекты.
 *
 * localStorage может бросить исключение (приватный режим, запрет
 * cookies, переполнение) — тогда фича просто молча не работает,
 * а не роняет страницу.
 */
const key = (userId: number) => `jira:mainProject:${userId}`;

export const getMainProject = (userId: number): number | null => {
  try {
    const id = Number(localStorage.getItem(key(userId)));
    return Number.isInteger(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
};

export const setMainProject = (userId: number, projectId: number | null) => {
  try {
    if (projectId === null) localStorage.removeItem(key(userId));
    else localStorage.setItem(key(userId), String(projectId));
  } catch {
    // нет доступа к хранилищу — выбор не запомнится
  }
};

/** Куда вести после входа, если пользователь не шёл никуда конкретно. */
export const homePathFor = (userId: number): string => {
  const main = getMainProject(userId);
  return main ? `/project/${main}` : "/";
};
