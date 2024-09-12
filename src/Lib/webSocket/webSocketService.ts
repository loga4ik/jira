export interface Message {
  projectId: number;
  user_id: number;
  text: string;
}

type OnMessageReceived = (message: Message) => void;

const WEB_SOCKET_URL = "ws://localhost:4000/ws"; // URL вашего WebSocket сервера

let ws: WebSocket | null = null;

export const connectWebSocket = (
  onMessageReceived: OnMessageReceived
): void => {
  if (ws) {
    console.warn("WebSocket connection already established");
    return;
  }

  ws = new WebSocket(WEB_SOCKET_URL);

  ws.onopen = () => {
    console.log("WebSocket connection opened");
  };

  ws.onmessage = (event: MessageEvent) => {
    try {
      const parsedMessage: Message = JSON.parse(event.data);
      onMessageReceived(parsedMessage);
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  ws.onclose = () => {
    console.log("WebSocket connection closed");
  };

  ws.onerror = (error: Event) => {
    console.error("WebSocket error:", error);
  };
};

export const sendMessage = (message: Message): void => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    console.error("WebSocket is not open");
  }
};

export const closeWebSocket = (): void => {
  if (ws) {
    ws.close();
    ws = null; // Clear the WebSocket connection
  }
};
