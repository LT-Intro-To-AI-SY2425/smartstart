import React, { createContext, useContext, useState } from "react";
import { FlashMessageType } from "../components/Alert";

interface FlashMessage {
  id: string;
  message: string;
  type: FlashMessageType;
  title: string;
}

interface FlashContextType {
  flashes: FlashMessage[];
  addFlash: (flash: FlashMessage) => void;
  removeFlash: (id: string) => void;
}

const FlashContext = createContext<FlashContextType | undefined>(undefined);

export const useFlashes = () => {
  const context = useContext(FlashContext);
  if (!context) {
    throw new Error("useFlashes must be used within a FlashProvider");
  }
  return context;
};

export const FlashProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [flashes, setFlashes] = useState<FlashMessage[]>([]);

  const addFlash = (flash: FlashMessage) => {
    console.log(flash);
    setFlashes((prevFlashes) => [...prevFlashes, flash]);
  };

  const removeFlash = (id: string) => {
    setFlashes((prevFlashes) => prevFlashes.filter((flash) => flash.id !== id));
  };

  return (
    <FlashContext.Provider value={{ flashes, addFlash, removeFlash }}>
      {children}
    </FlashContext.Provider>
  );
};
