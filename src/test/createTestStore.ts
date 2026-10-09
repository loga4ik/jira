import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../Lib/api/userApi";

/**
 * Свежий store для одного теста. Кэш RTK Query живёт в store,
 * поэтому общий store протащил бы данные из одного теста в другой.
 * Подключён только userApi: остальным частям приложения в этих тестах
 * делать нечего, а чем меньше лишнего, тем понятнее, что проверяется.
 */
export const createTestStore = () =>
  configureStore({
    reducer: { [userApi.reducerPath]: userApi.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(userApi.middleware),
  });

export type TestStore = ReturnType<typeof createTestStore>;
