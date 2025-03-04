import React from "react";
import clsx from "clsx";
import { TypingText } from "../../components/Typing";
import Threads from "../../components/Threads/Threads";

interface MessageProps {
  role: "user" | "assistant";
  text: string;
  isNew?: boolean;
  isLoading?: boolean;
}

export function MessageBubble({
  role,
  text,
  isNew = false,
  isLoading = false,
}: MessageProps) {
  return (
    <div className="flex">
      <div
        className={clsx(
          "inline-block",
          isLoading && "w-full",
          role === "user"
            ? "bg-gray-100 text-right max-w-lg ml-auto rounded-3xl px-5 py-2.5 my-[18px]"
            : "text-left",
        )}
      >
        {isLoading ? (
          <Threads
            amplitude={2.8}
            distance={0.1}
            enableMouseInteraction={false}
          />
        ) : role === "assistant" && isNew ? (
          <TypingText text={text} />
        ) : (
          text
        )}
      </div>
    </div>
  );
}
