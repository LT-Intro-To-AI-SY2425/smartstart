import React from "react";

interface ChatInputProps {
  prompt: string;
  setPrompt: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function ChatInput({
  prompt,
  setPrompt,
  handleSubmit,
  isLoading,
}: ChatInputProps) {
  return (
    <div className="max-w-3xl w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full cursor-text rounded-3xl border border-gray-300 shadow-lg"
      >
        <input
          type="text"
          className="w-full min-h-[44px] pl-4 outline-none bg-transparent"
          placeholder="Type your message..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="flex justify-end mt-3">
          <button
            type="submit"
            disabled={prompt.length === 0 || isLoading}
            className="bg-blue-400 disabled:bg-gray-300 text-white p-2 rounded-full hover:bg-blue-500 m-3 ml-auto transition-colors duration-150"
          >
            {isLoading ? (
              <svg
                className="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
                />
              </svg>
            )}
          </button>
        </div>
      </form>
      <div className="flex flex-col justify-center items-center">
        <span className="text-gray-400 text-xs text-center mt-4">
          SmartStart & CME Group 2025
        </span>
      </div>
    </div>
  );
}
