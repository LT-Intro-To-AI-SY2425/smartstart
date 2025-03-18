import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const wordVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

interface TextSegment {
  text: string;
  isBold?: boolean;
  isItalic?: boolean;
  isListItem?: boolean;
  isSource?: boolean;
  sourceDisplayName?: string;
  sourceURL?: string;
}

export function TypingText({
  text,
  speed = 30,
  className,
  dontType = false,
}: {
  text: string;
  speed?: number;
  className?: string;
  dontType?: boolean;
}) {
  // If dontType is true, we want to immediately show the complete text.
  const [isTypingComplete, setIsTypingComplete] = useState(dontType);

  const staggerSpeed = speed / 1000;

  // Parse markdown into an array of lines (each line is an array of segments).
  const parseMarkdown = (text: string): TextSegment[][] => {
    const lines = text.split("\n");
    const parsedLines: TextSegment[][] = lines.map((line) => {
      const segments: TextSegment[] = [];
      let currentPos = 0;
      // Detect if the line is a list item.
      const isListItem = /^\s*\*\s/.test(line);
      if (isListItem) {
        // Push the bullet without a trailing space.
        segments.push({ text: "•", isListItem: true });
        // Remove the bullet marker and any extra whitespace.
        line = line.replace(/^\s*\*\s*/, "");
      }
      while (currentPos < line.length) {
        // Check for a source tag.
        if (line.startsWith("[[SOURCE:", currentPos)) {
          const endPos = line.indexOf("]]", currentPos);
          if (endPos !== -1) {
            const sourceContent = line.slice(
              currentPos + "[[SOURCE:".length,
              endPos,
            );
            const [displayName, url] = sourceContent
              .split("|")
              .map((s) => s.trim());
            segments.push({
              text: `[[SOURCE: ${displayName} | ${url}]]`,
              isSource: true,
              sourceDisplayName: displayName,
              sourceURL: url,
              isListItem,
            });
            currentPos = endPos + 2;
            continue;
          }
        }
        // Check for bold formatting.
        if (line.startsWith("**", currentPos)) {
          const endPos = line.indexOf("**", currentPos + 2);
          if (endPos !== -1) {
            segments.push({
              text: line.slice(currentPos + 2, endPos),
              isBold: true,
              isListItem,
            });
            currentPos = endPos + 2;
            continue;
          }
        }
        // Check for italic formatting.
        if (line.startsWith("*", currentPos)) {
          const endPos = line.indexOf("*", currentPos + 1);
          if (endPos !== -1) {
            segments.push({
              text: line.slice(currentPos + 1, endPos),
              isItalic: true,
              isListItem,
            });
            currentPos = endPos + 1;
            continue;
          }
        }
        // Find the next special marker.
        const nextSource = line.indexOf("[[SOURCE:", currentPos);
        const nextBold = line.indexOf("**", currentPos);
        const nextItalic = line.indexOf("*", currentPos);
        const nextSpecial = Math.min(
          nextSource === -1 ? Infinity : nextSource,
          nextBold === -1 ? Infinity : nextBold,
          nextItalic === -1 ? Infinity : nextItalic,
        );
        const textEnd = nextSpecial === Infinity ? line.length : nextSpecial;
        if (textEnd > currentPos) {
          segments.push({
            text: line.slice(currentPos, textEnd),
            isListItem,
          });
        }
        currentPos = textEnd;
      }
      return segments;
    });
    return parsedLines;
  };

  const lines = parseMarkdown(text);
  const totalSegments = lines.reduce((acc, line) => acc + line.length, 0);
  const totalDuration = totalSegments * speed;

  useEffect(() => {
    if (!dontType) {
      const timer = setTimeout(() => {
        setIsTypingComplete(true);
      }, totalDuration + 100);
      return () => clearTimeout(timer);
    }
  }, [dontType, totalDuration]);

  // Render a segment (static output).
  const renderSegment = (
    segment: TextSegment,
    key: number,
    indent: boolean = false,
  ) => {
    let content: React.ReactNode = segment.text;

    if (segment.isSource) {
      content = (
        <a
          href={segment.sourceURL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-200 rounded-md px-1 py-0.5"
        >
          {segment.sourceDisplayName}
        </a>
      );
    } else if (segment.isBold && segment.isItalic) {
      content = (
        <strong>
          <em>{segment.text}</em>
        </strong>
      );
    } else if (segment.isBold) {
      content = <strong>{segment.text}</strong>;
    } else if (segment.isItalic) {
      content = <em>{segment.text}</em>;
    }
    return (
      <span
        key={key}
        className={clsx("inline-block", "mr-[0.22em]", indent && "ml-1")}
      >
        {content}
      </span>
    );
  };

  // Render a segment with animation.
  const renderAnimatedSegment = (
    segment: TextSegment,
    key: number,
    indent: boolean = false,
  ) => {
    let content: React.ReactNode = segment.text;

    if (segment.isSource) {
      content = (
        <a
          href={segment.sourceURL}
          target="_blank"
          rel="noopener noreferrer"
          className="source-tag"
        >
          {`[[SOURCE: ${segment.sourceDisplayName} | ${segment.sourceURL}]]`}
        </a>
      );
    } else if (segment.isBold && segment.isItalic) {
      content = (
        <strong>
          <em>{segment.text}</em>
        </strong>
      );
    } else if (segment.isBold) {
      content = <strong>{segment.text}</strong>;
    } else if (segment.isItalic) {
      content = <em>{segment.text}</em>;
    }
    return (
      <motion.span
        key={key}
        variants={wordVariants}
        className={clsx("inline-block", "mr-[0.22em]", indent && "ml-1")}
      >
        {content}
      </motion.span>
    );
  };

  const dynamicContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerSpeed,
      },
    },
  };

  if (isTypingComplete) {
    return (
      <div className={className}>
        {lines.map((lineSegments, lineIndex) => (
          <div key={`line-${lineIndex}`}>
            {lineSegments.length ? (
              lineSegments.map((segment, segIndex) =>
                segIndex === 0 && segment.isListItem
                  ? renderSegment(segment, segIndex, false)
                  : renderSegment(segment, segIndex, segment.isListItem),
              )
            ) : (
              <br />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className={clsx("block", className)}
        variants={dynamicContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {lines.map((lineSegments, lineIndex) => (
          <motion.div key={`line-${lineIndex}`} style={{ display: "block" }}>
            {lineSegments.length ? (
              lineSegments.map((segment, segIndex) =>
                segIndex === 0 && segment.isListItem
                  ? renderAnimatedSegment(segment, segIndex, false)
                  : renderAnimatedSegment(
                      segment,
                      segIndex,
                      segment.isListItem,
                    ),
              )
            ) : (
              <motion.span key={`empty-${lineIndex}`}>
                <br />
              </motion.span>
            )}
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
