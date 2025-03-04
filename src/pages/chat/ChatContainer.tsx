import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Logo } from "../../components/Logo";

interface Message {
  role: "user" | "assistant";
  text: string;
  isNew?: boolean;
  isLoading?: boolean;
}

interface ChatResponse {
  response_text: string;
  user_id?: string;
}

function Chat() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadConversationHistory = async (userId: string) => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5050/history/${userId}`,
        );
        const historicalMessages = response.data.conversation.map(
          (msg: Message) => ({
            ...msg,
            isNew: false,
          }),
        );
        setConversation(historicalMessages);
      } catch (error) {
        console.error("error loading conversation history:", error);
      }
    };

    const storedUserId = localStorage.getItem("chat_user_id");
    if (storedUserId) {
      setUserId(storedUserId);
      loadConversationHistory(storedUserId);
    }
  }, []);

  const mutation = useMutation<AxiosResponse<ChatResponse>, Error, string>({
    mutationFn: (newPrompt) =>
      axios.post("http://127.0.0.1:5050/chat", {
        conversation,
        prompt: newPrompt,
        user_id: userId,
      }),
    onSuccess: (response) => {
      // save userId if it's a new conversation
      if (!userId && response.data.user_id) {
        localStorage.setItem("chat_user_id", response.data.user_id);
        setUserId(response.data.user_id);
      }
      setConversation((prev) => {
        const newConversation = [...prev];

        newConversation.pop();

        newConversation.push({
          role: "assistant",
          text: response.data.response_text,
          isNew: true,
        });
        return newConversation;
      });
    },
    onError: (error) => console.error("Error:", error),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setConversation((prev) => [
      ...prev,
      { role: "user", text: prompt, isNew: false },
      { role: "assistant", text: "", isNew: false, isLoading: true },
    ]);
    mutation.mutate(prompt);
    setPrompt("");
  };

  return (
    <div className="h-screen w-full bg-gray-50">
      {conversation.length === 0 ? (
        <div className="h-full flex flex-col justify-center items-center">
          <Logo />
          <h1 className="font-semibold text-gray-900 text-2xl sm:text-3xl text-center leading-[2.25rem] mb-7 mt-4">
            How can I help?
          </h1>
          <ChatInput
            prompt={prompt}
            setPrompt={setPrompt}
            handleSubmit={handleSubmit}
            isLoading={mutation.isPending}
          />
        </div>
      ) : (
        <div className="h-full flex flex-col max-w-3xl mx-auto">
          <div className="flex-grow overflow-y-auto p-4 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {conversation.map((msg, index) => (
              <MessageBubble
                key={index}
                role={msg.role}
                text={msg.text}
                isNew={msg.isNew}
                isLoading={msg.isLoading}
              />
            ))}
          </div>
          <div className="mb-4">
            <ChatInput
              prompt={prompt}
              setPrompt={setPrompt}
              handleSubmit={handleSubmit}
              isLoading={mutation.isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const queryClient = new QueryClient();
export function ChatContainer() {
  return (
    <QueryClientProvider client={queryClient}>
      <Chat />
    </QueryClientProvider>
  );
}
