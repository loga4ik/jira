import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../Lib/api/userApi";
import projectSlice from "../Lib/Slices/projectSlice/projectSlice";

/**
 * Свежий store для одного теста. Кэш RTK Query живёт в store,
 * поэтому общий store протащил бы данные из одного теста в другой.
 * Те же редьюсеры, что в настоящем store: userApi и состояние проекта.
 */
export const createTestStore = () =>
  configureStore({
    reducer: {
      project: projectSlice,
      [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(userApi.middleware),
  });

export type TestStore = ReturnType<typeof createTestStore>;
