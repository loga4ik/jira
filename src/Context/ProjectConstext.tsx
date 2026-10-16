import React, { useState, createContext, ReactNode } from "react";

/**
 * Состояние, которое есть только в интерфейсе страницы проекта:
 * какая задача выбрана для редактирования. Данные с сервера (проект,
 * задачи, команда, статусы) здесь не храним — они в кэше RTK Query.
 */
type ProjectContextType = {
  taskIdToEdite: number | undefined;
  changeTaskId(taskId: number): void;
};

export const ProjectContext = createContext<ProjectContextType>(
  {} as ProjectContextType
);

type ProviderProps = {
  children: ReactNode;
};

export const ProjectContextWrapper: React.FC<ProviderProps> = ({
  children,
}) => {
  const [taskIdToEdite, setTaskIdToEdite] = useState<number | undefined>();

  // повторный клик по выбранной задаче снимает выбор
  const changeTaskId = (taskId: number | undefined) => {
    setTaskIdToEdite(taskId === taskIdToEdite ? undefined : taskId);
  };

  return (
    <ProjectContext.Provider value={{ taskIdToEdite, changeTaskId }}>
      {children}
    </ProjectContext.Provider>
  );
};
