import { getAccessToken, refreshAccessToken } from "../api/authToken";

export interface Message {
  projectId: number;
  user_id: number;
  text: string;
}

type OnMessageReceived = (message: Message) => void;

/**
 * Чат ходит на тот же origin, что и страница (в разработке — через vite-прокси),
 * а не на захардкоженный адрес. Токен — query-параметром: браузерный WebSocket
 * не умеет передавать заголовки.
 */
const buildUrl = (token: string) => {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws?token=${encodeURIComponent(token)}`;
};

let ws: WebSocket | null = null;

// Номер текущего подключения. Если компонент размонтировали, пока мы ждали
// токен, результат устаревшего подключения просто выбрасываем.
let generation = 0;

export const connectWebSocket = async (
  onMessageReceived: OnMessageReceived,
  projectId: number
): Promise<void> => {
  const current = ++generation;

  // После перезагрузки страницы токена в памяти ещё нет — поднимаем его по
  // refresh-куке. Если обновление уже идёт, refreshAccessToken вернёт тот же промис.
  if (!getAccessToken()) await refreshAccessToken();
  const token = getAccessToken();

  if (current !== generation) return;
  if (!token) {
    console.error("Нет токена для подключения к чату");
    return;
  }

  ws?.close();
  const socket = new WebSocket(buildUrl(token));
  ws = socket;

  socket.onopen = () => {
    socket.send(JSON.stringify({ type: "join_room", projectId }));
  };

  socket.onmessage = (event: MessageEvent) => {
    try {
      const parsed = JSON.parse(event.data);
      if (parsed.type === "error") {
        console.error("Чат:", parsed.message);
        return;
      }
      onMessageReceived(parsed as Message);
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  socket.onerror = (error: Event) => {
    console.error("WebSocket error:", error);
  };
};

/** Автора сервер берёт из токена соединения, поэтому отправляем только текст. */
export const sendMessage = ({ text }: { text: string }): void => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ text }));
  } else {
    console.error("WebSocket is not open");
  }
};

export const closeWebSocket = (): void => {
  generation++;
  ws?.close();
  ws = null;
};
