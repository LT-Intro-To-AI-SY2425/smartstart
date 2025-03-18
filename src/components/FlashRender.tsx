import React from "react";
import { useFlashes } from "../hooks/useFlashes";
import Alert from "./Alert";

const FlashMessages: React.FC = () => {
  const { flashes } = useFlashes();

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-100 flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {flashes.map((flash) => (
          <Alert key={flash.id} type={flash.type} title={flash.title}>
            {flash.message}
          </Alert>
        ))}
      </div>
    </div>
  );
};

export default FlashMessages;
