import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

type Message = {
  sender: "user" | "bot";
  text: string;
};

export function ChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const botMsgIndexRef = useRef<number | null>(null); // ✅ Armazena o índice da última msg do bot

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setLoading(true);
    setError("");
    setInput("");

    const envUrl = import.meta.env.VITE_API_URL;

    if (!envUrl) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Error trying to access API. Please try again later.",
        },
      ]);
      setLoading(false);
      return;
    }

    // ✅ Adiciona a mensagem vazia do bot e guarda o índice com ref
    setMessages((prev) => {
      const index = prev.length;
      botMsgIndexRef.current = index;
      return [...prev, { sender: "bot", text: "" }];
    });

    const eventSource = new EventSource(
      `${envUrl}/chat/stream?message=${encodeURIComponent(userMessage)}`
    );

    let hasCompleted = false;

    eventSource.onmessage = (event) => {
      console.log("Token recebido:", event.data);

      if (event.data === "[[END]]") {
        hasCompleted = true;
        eventSource.close();
        return;
      }

      setMessages((prev) => {
        const updated = [...prev];
        const index = botMsgIndexRef.current;
        if (index !== null && updated[index]?.sender === "bot") {
          updated[index] = {
            ...updated[index], // <-- Corrigido: nova referência
            text: updated[index].text + event.data,
          };
        }
        return updated;
      });
    };

    eventSource.onerror = () => {
      if (hasCompleted) return;
      setMessages((prev) => {
        const updated = [...prev];
        const index = botMsgIndexRef.current;
        if (index !== null) {
          updated[index] = {
            sender: "bot",
            text: "Connection lost, please retry.",
          };
        }
        return updated;
      });
      setLoading(false);
      eventSource.close();
    };

    eventSource.onopen = () => {
      setLoading(false);
    };
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim() && !loading) {
      sendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow bg-white flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-lg bg-gray-200 text-black">
              Typing...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <Alert variant="destructive" className="mb-2">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button onClick={sendMessage} disabled={!input.trim() || loading}>
          Send
        </Button>
      </div>
    </div>
  );
}
