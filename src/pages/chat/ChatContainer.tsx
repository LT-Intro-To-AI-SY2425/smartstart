import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Logo, Mark } from "../../components/Logo";
import { ChatInput } from "./ChatInput";
import { MessageBubble } from "./MessageBubble";
import { useChat } from "../../hooks/useChat";
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
import Avatar from "boring-avatars";

function Chat() {
  const {
    conversation,
    userId,
    prompt,
    setPrompt,
    title,
    handleSubmit,
    isLoading,
    handleClearChat,
    clearChatOpen,
    setClearChatOpen,
  } = useChat();

  return (
    <div className="h-screen w-full bg-gray-50">
      {conversation.length === 0 ? (
        <>
          <div className="h-full flex flex-col justify-center items-center">
            <Logo />
            <h1 className="font-semibold text-gray-900 text-2xl sm:text-3xl text-center leading-[2.25rem] mb-7 mt-4 inter-bold">
              How can I help?
            </h1>
            <ChatInput
              prompt={prompt}
              setPrompt={setPrompt}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </>
      ) : (
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-3 border-gray-200">
            <div className="flex items-center gap-3">
              <Mark className="size-8" />
              <h2 className="text-lg font-medium text-gray-900 truncate max-w-[90%] inter-bold">
                {/* {title && (
                  <TypingText
                    text={title}
                    speed={100}
                    className="font-semibold text-gray-600 text-lg"
                  />
                )} */}
                {title}
              </h2>
            </div>
            <div className="flex items-center gap-2">
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
                  <Avatar
                    size={32}
                    name={userId || "default"}
                    variant="beam"
                    className="hover:brightness-80 transition duration-100"
                  />
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
              isLoading={isLoading}
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
