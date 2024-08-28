import React, { useEffect, useState } from "react";

export const useLocalStorage = (key: string, initialValue: string) => {
  const [localStorageValue, setLocalStorageValue] = useState<string>(
    localStorage.getItem(key) || initialValue
  );

  useEffect(() => {
    localStorage.setItem(key, localStorageValue);
  }, [key, localStorageValue]);

  const setItem = (value: string) => {
    setLocalStorageValue(value);
  };
  return { localStorageValue, setItem };
};

// export function useLocalStorage<T>(
//     key: string,
//     defaultValue: T,
//   ): readonly [T, React.Dispatch<React.SetStateAction<T>>] {
//     const [value, setValue] = useState<T>(() =>
//       electronStorage.has(key)
//         ? (electronStorage.get(key) as T)
//         : typeof defaultValue === 'function'
//         ? (defaultValue() as T)
//         : defaultValue,
//     )

//     useEffect(() => {
//       electronStorage.set(key, value)
//     }, [key, value])

//     return [value, setValue] as const
//   }
