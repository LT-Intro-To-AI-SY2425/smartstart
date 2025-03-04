import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const wordVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function TypingText({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <motion.div
      className="inline-block"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordVariants}
          className="inline-block mr-1"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
