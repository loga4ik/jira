import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ThemeContextWrapper } from "../Context/ThemeContext";
import { createTestStore, type TestStore } from "./createTestStore";

type Options = {
  /** С какого адреса «открыта» страница. */
  route?: string;
  /** Путь, по которому смонтирован тестируемый компонент. */
  path?: string;
  /** Свой store, если тесту нужно заранее что-то в него положить. */
  store?: TestStore;
};

/**
 * Рисует компонент со всем, что ему нужно от приложения:
 * Redux store, роутер и тема. Без провайдеров useLoginMutation
 * или useNavigate упадут — им не к чему подключиться.
 *
 * MemoryRouter — роутер без адресной строки браузера: история живёт
 * в памяти, и тест сам задаёт стартовый адрес. Кроме тестируемой
 * страницы смонтирована заглушка главной — по её тексту видно,
 * что произошёл переход.
 *
 * Возвращает всё, что вернул render, плюс store и user — объект
 * user-event, через который тест печатает и кликает.
 */
export const renderWithProviders = (
  ui: ReactElement,
  { route = "/login", path = "/login", store = createTestStore() }: Options = {},
) => {
  // setup() до render — так рекомендует user-event: он готовит
  // клавиатуру и указатель, которыми будут пользоваться все действия.
  const user = userEvent.setup();

  const result = render(
    <Provider store={store}>
      <ThemeContextWrapper>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path={path} element={ui} />
            <Route path="/" element={<p>Главная страница</p>} />
          </Routes>
        </MemoryRouter>
      </ThemeContextWrapper>
    </Provider>,
  );

  return { ...result, store, user };
};
