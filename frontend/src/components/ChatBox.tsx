import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

// Message structure: user or bot sender and text content
type Message = {
  sender: "user" | "bot";
  text: string;
};

export function ChatBox() {
  // State hooks for input text, chat messages, loading indicator, and error message
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Used to auto-scroll to the last message
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Stores the index of the latest bot message for streaming updates
  const botMsgIndexRef = useRef<number | null>(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;

    // Append user message to conversation
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setLoading(true);
    setError("");
    setInput("");

    const envUrl = import.meta.env.VITE_API_URL;

    // Fallback if API base URL is not set
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

    // Optimistically append a placeholder bot message for streaming
    setMessages((prev) => {
      const index = prev.length;
      botMsgIndexRef.current = index;
      return [...prev, { sender: "bot", text: "" }];
    });

    // Open SSE connection to receive streamed reply
    const eventSource = new EventSource(
      `${envUrl}/chat/stream?message=${encodeURIComponent(userMessage)}`
    );

    let hasCompleted = false;

    // Append each token as it's received
    eventSource.onmessage = (event) => {
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
            ...updated[index],
            text: updated[index].text + event.data,
          };
        }
        return updated;
      });
    };

    // Handle errors: show fallback bot message
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

    // Once connection is established, stop showing "Typing..."
    eventSource.onopen = () => {
      setLoading(false);
    };
  };

  // Allow submission via Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim() && !loading) {
      sendMessage();
    }
  };

  // Scroll to the last message when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow bg-white flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-2">
        {/* Render all chat messages */}
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

        {/* Show "Typing..." indicator while loading */}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-lg bg-gray-200 text-black">
              Typing...
            </div>
          </div>
        )}

        {/* Invisible div to allow smooth scrolling to bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Render error alert if needed */}
      {error && (
        <Alert variant="destructive" className="mb-2">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Message input and send button */}
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
