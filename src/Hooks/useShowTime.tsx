import { useState, useEffect, useRef } from "react";

/**
 * Показывает что-то после задержки наведения (300 мс).
 *
 * Таймер хранится в useRef: обычная переменная пересоздавалась
 * на каждом рендере, и endHover не мог отменить таймер,
 * запущенный до перерисовки.
 */
function useShowTime(callback: () => void) {
  const [isHovered, setIsHovered] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  const startHover = () => {
    timeout.current = setTimeout(() => {
      setIsHovered(true);
      callback();
    }, 300);
  };

  const endHover = () => {
    clearTimeout(timeout.current);
    setIsHovered(false);
  };

  // Отменяем таймер при размонтировании (уход на другую страницу).
  // Раньше здесь было return clearTimeout(timeout) — таймер чистился
  // один раз при монтировании, а функции очистки не было вовсе.
  useEffect(() => () => clearTimeout(timeout.current), []);

  return {
    startHover,
    endHover,
    isHovered,
  };
}

export default useShowTime;
