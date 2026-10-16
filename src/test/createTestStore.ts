import { configureStore } from "@reduxjs/toolkit";
import { api } from "../Lib/api/api";

/**
 * Свежий store для одного теста. Кэш RTK Query живёт в store,
 * поэтому общий store протащил бы данные из одного теста в другой.
 * Тот же редьюсер, что в настоящем store, — кэш API.
 */
export const createTestStore = () =>
  configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

export type TestStore = ReturnType<typeof createTestStore>;
