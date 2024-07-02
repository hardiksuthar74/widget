import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";

interface Message {
  message: string;
  id: string;
}

export const App = () => {
  const [message, setMessage] = useState<Message | null>(null);
  const [userMessage, setUserMessage] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.on("message", (data: Message) => {
      setMessage(data);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (socket) {
      socket.emit("userMessage", userMessage);
      setUserMessage("");
    }
  };

  return (
    <div>
      <div>{message?.message}</div>
      <form onSubmit={formSubmitHandler}>
        <div>
          <input
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            name="message"
          />
          <button>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default App;
