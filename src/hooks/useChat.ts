import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import { FunctionCall, FunctionName, ChatResponse } from "../types/chat";

interface Message {
  role: "user" | "assistant";
  text: string;
  isNew?: boolean;
  isLoading?: boolean;
  function_calls?: FunctionCall<FunctionName>[];
}

export function useChat() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [clearChatOpen, setClearChatOpen] = useState(false);

  const createConversation = useMutation({
    mutationFn: () => axios.post("http://127.0.0.1:5050/conversations"),
    onSuccess: (response) => {
      const newUserId = response.data.user_id;
      localStorage.setItem("chat_user_id", newUserId);
      setUserId(newUserId);
    },
  });

  const clearConversation = useMutation({
    mutationFn: () =>
      axios.delete(`http://127.0.0.1:5050/conversations/${userId}`),
    onSuccess: () => {
      setConversation([]);
      setTitle("");
      setUserId(null);
      localStorage.removeItem("chat_user_id");
    },
    onError: (error) => console.error("Error clearing conversation:", error),
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("chat_user_id");
    if (!storedUserId || userId) return;

    setUserId(storedUserId);

    const loadConversationHistory = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5050/history/${storedUserId}`,
        );
        const historicalMessages = response.data.conversation.map(
          (msg: Message) => ({
            ...msg,
            isNew: false,
          }),
        );
        setConversation(historicalMessages);
        if (response.data.title) setTitle(response.data.title);
      } catch (error) {
        console.error("Error loading conversation history:", error);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          localStorage.removeItem("chat_user_id");
          createConversation.mutate();
        }
      }
    };

    loadConversationHistory();
  }, [userId]);

  const mutation = useMutation<AxiosResponse<ChatResponse>, Error, string>({
    mutationFn: async (newPrompt) => {
      if (!userId) {
        const newConversation = await createConversation.mutateAsync();
        return axios.post(
          `http://127.0.0.1:5050/chat/${newConversation.data.user_id}`,
          { prompt: newPrompt },
        );
      }
      return axios.post(`http://127.0.0.1:5050/chat/${userId}`, {
        prompt: newPrompt,
      });
    },
    onSuccess: (response) => {
      if (response.data.title) setTitle(response.data.title);
      setConversation((prev) => {
        const newConversation = [...prev];
        newConversation.pop();
        newConversation.push({
          role: "assistant",
          text: response.data.response_text,
          isNew: true,
          function_calls: response.data.function_calls,
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

  const handleClearChat = () => {
    setClearChatOpen(false);
    if (userId) clearConversation.mutate();
  };

  return {
    conversation,
    prompt,
    setPrompt,
    title,
    userId,
    clearChatOpen,
    setClearChatOpen,
    handleSubmit,
    handleClearChat,
    isLoading: mutation.isPending,
  };
}
