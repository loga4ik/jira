import React, { useEffect, useState } from "react";
import {
  closeWebSocket,
  connectWebSocket,
  Message,
  sendMessage,
} from "../../../../../Lib/webSocket/webSocketService";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../Lib/store";

const ChatBoard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const projectId = 1;
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  useEffect(() => {
    console.log(
      fetch(`/api/message/${projectId}`)
        .then((response) => response.json())
        .then((data) => setMessages(data))
        .catch((error) => console.error("Error fetching messages:", error))
    );

    const onMessageReceived = (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    connectWebSocket(onMessageReceived);

    // Очистка WebSocket соединения при размонтировании компонента
    return () => {
      closeWebSocket(); // Properly close WebSocket connection
    };
  }, []);

  const handleSendMessage = () => {
    if (currentUser?.id) {
      const message: Message = {
        projectId,
        user_id: currentUser.id,
        text: messageText,
      };
      sendMessage(message);
      setMessageText("");
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>User {msg.user_id}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatBoard;
