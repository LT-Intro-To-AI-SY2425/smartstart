import React, { useState } from "react";
import clsx from "clsx";
import { TypingText } from "../../components/Typing";
import Threads from "../../components/Threads/Threads";
import { FunctionCall, FunctionName } from "../../types/chat";
import { motion, AnimatePresence } from "framer-motion";

interface MessageProps {
  role: "user" | "assistant";
  text: string;
  isNew?: boolean;
  isLoading?: boolean;
  function_calls?: FunctionCall<FunctionName>[];
}

function FunctionCallDisplay({ call }: { call: FunctionCall<FunctionName> }) {
  return (
    <div className="mt-2 text-sm text-gray-600 border-l-2 border-blue-200 pl-2">
      <div className="font-medium">{call.function_name}</div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="text-xs text-gray-500">Input:</div>
          <pre className="text-xs font-mono">
            {JSON.stringify(call.inputs, null, 2)}
          </pre>
        </div>
        <div>
          <div className="text-xs text-gray-500">Output:</div>
          <pre className="text-xs  font-mono">
            {JSON.stringify(call.outputs, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

function FunctionCallsWrapper({
  calls,
}: {
  calls: FunctionCall<FunctionName>[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (calls.length === 0)
    return (
      <span className="text-xs text-gray-500 hover:text-red-500">
        No function calls, double check all information.
      </span>
    );

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs text-gray-500 hover:text-gray-700"
      >
        {isExpanded ? "Hide" : "Show"} {calls.length} function call
        {calls.length > 1 ? "s" : ""}
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {calls.map((call, index) => (
              <FunctionCallDisplay key={index} call={call} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MessageBubble({
  role,
  text,
  isNew = false,
  isLoading = false,
  function_calls = [],
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
            amplitude={3.8}
            distance={0.1}
            enableMouseInteraction={false}
          />
        ) : (
          <>
            <TypingText text={text} dontType={role !== "assistant" || !isNew} />
            {role === "assistant" && (
              <FunctionCallsWrapper calls={function_calls} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
