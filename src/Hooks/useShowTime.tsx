import { useState, useEffect } from "react";

function useShowTime(callback: () => void) {
  const [isHovered, setIsHovered] = useState(false);

  let timeout: ReturnType<typeof setTimeout>;

  const startHover = () => {
    timeout = setTimeout(() => {
      setIsHovered(true);
      callback();
    }, 300);
  };

  const endHover = () => {
    clearTimeout(timeout);
    setIsHovered(false);
  };

  // мы используем кастомный хук, для clearTimeout(timeout)
  // при переходе на другую страничку

  useEffect(() => {
    return clearTimeout(timeout);
  }, []);

  return {
    startHover,
    endHover,
    isHovered,
  };
}

export default useShowTime;
