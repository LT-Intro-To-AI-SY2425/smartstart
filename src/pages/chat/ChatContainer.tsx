import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Logo } from "../../components/Logo";
import Avatar from "boring-avatars";
import { TypingText } from "../../components/Typing";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "../../components/Dropdown";
import { BookOpenIcon, TrashIcon } from "@heroicons/react/16/solid";
import {
  DialogActions,
  DialogDescription,
  DialogTitle,
  Dialog,
} from "../../components/Dialog";
import { Button } from "../../components/Button";
import { ChatResponse, FunctionCall, FunctionName } from "../../types/chat";

interface Message {
  role: "user" | "assistant";
  text: string;
  isNew?: boolean;
  isLoading?: boolean;
  function_calls?: FunctionCall<FunctionName>[];
}

function Chat() {
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
    if (!storedUserId || userId) {
      return; // exit if no stored ID or if we already have a userId
    }

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
        if (response.data.title) {
          setTitle(response.data.title);
        }
      } catch (error) {
        console.error("Error loading conversation history:", error);

        if (axios.isAxiosError(error) && error.response?.status === 404) {
          console.log("Saved UUID not found, creating new conversation");
          localStorage.removeItem("chat_user_id");
          createConversation.mutate();
        }
      }
    };

    loadConversationHistory();
  }, [userId]);

  const mutation = useMutation<AxiosResponse<ChatResponse>, Error, string>({
    mutationFn: async (newPrompt) => {
      // if no userId, create a new conversation first
      if (!userId) {
        const newConversation = await createConversation.mutateAsync();
        return axios.post(
          `http://127.0.0.1:5050/chat/${newConversation.data.user_id}`,
          {
            prompt: newPrompt,
          },
        );
      }

      return axios.post(`http://127.0.0.1:5050/chat/${userId}`, {
        prompt: newPrompt,
      });
    },
    onSuccess: (response) => {
      if (response.data.title) {
        setTitle(response.data.title);
      }
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
    if (userId) {
      clearConversation.mutate();
    }
  };

  return (
    <div className="h-screen w-full bg-gray-50">
      {conversation.length === 0 ? (
        <>
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
        </>
      ) : (
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-3 border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 truncate max-w-[80%]">
              {title && (
                <TypingText
                  text={title}
                  speed={100}
                  className="font-semibold text-gray-600 text-lg"
                />
              )}
            </h2>
            <div className="flex items-center gap-2">
              {userId && (
                <TypingText
                  text={userId.replace(/-/g, " ")}
                  speed={100}
                  className="font-light text-gray-500 text-sm"
                />
              )}
              <Dialog open={clearChatOpen} onClose={setClearChatOpen}>
                <DialogTitle>Clear Chat</DialogTitle>
                <DialogDescription>
                  Are you sure you want to clear the chat?
                </DialogDescription>
                <DialogActions>
                  <Button plain onClick={() => setClearChatOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleClearChat}>Clear</Button>
                </DialogActions>
              </Dialog>
              <Dropdown>
                <DropdownButton as="button">
                  <Avatar size={32} name={userId || "default"} variant="beam" />
                </DropdownButton>
                <DropdownMenu className="min-w-64" anchor="bottom end">
                  <DropdownItem to="/about">
                    <BookOpenIcon />
                    <DropdownLabel>About</DropdownLabel>
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem
                    onClick={() => setClearChatOpen(true)}
                    className="data-[focus]:bg-red-500"
                  >
                    <TrashIcon />
                    <DropdownLabel>Clear Chat</DropdownLabel>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto">
            <div className="max-w-3xl mx-auto p-4 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {conversation.map((msg, index) => (
                <MessageBubble
                  key={index}
                  role={msg.role}
                  text={msg.text}
                  isNew={msg.isNew}
                  isLoading={msg.isLoading}
                  function_calls={msg.function_calls}
                />
              ))}
            </div>
          </div>
          <div className="max-w-3xl mx-auto w-full px-4 mb-4">
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
