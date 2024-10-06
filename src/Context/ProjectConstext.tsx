import React, { useState, createContext, ReactNode, useEffect } from "react";

type StatusType = {
  id: number;
  title: string;
};

type ProjectContextType = {
  statuses: { [key: number]: string }; // Теперь значение — это только title
  taskIdToEdite: number | undefined;
  changeTaskId(taskId: number): void;
};

const transformToStatusObject = (
  data: StatusType[]
): { [key: number]: string } => {
  return data.reduce((acc, status) => {
    acc[status.id] = status.title; // Сохраняем только title
    return acc;
  }, {} as { [key: number]: string });
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
  const [statuses, setStatuses] = useState<{ [key: number]: string }>({});
  const [taskIdToEdite, setTaskIdToEdite] = useState<number | undefined>();

  const changeTaskId = (taskId: number | undefined) => {
    if (taskId === taskIdToEdite) {
      setTaskIdToEdite(undefined);
    } else {
      setTaskIdToEdite(taskId);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      try {
        const response = await fetch("/api/status/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: abortController.signal,
        });

        if (response.ok) {
          const data: StatusType[] = await response.json();
          setStatuses(transformToStatusObject(data)); // Преобразуем данные в объект с ключами - id
        }
      } catch (error) {
        console.error("Error fetching statuses", error);
      }
    })();
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <ProjectContext.Provider value={{ statuses, taskIdToEdite, changeTaskId }}>
      {children}
    </ProjectContext.Provider>
  );
};
