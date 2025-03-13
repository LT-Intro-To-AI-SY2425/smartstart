import React, { useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

// Number of stars in the constellation
const NUM_STARS = 20;

// Component to generate a single star
const Star = ({ x, y, size }) => {
  return (
    <motion.div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: "black",
        boxShadow: "0 0 8px rgba(0, 0, 0, 1)",
      }}
    />
  );
};

// Component to generate a line between two stars
const ConstellationLine = ({ x1, y1, x2, y2 }) => {
  return (
    <motion.div
      style={{
        position: "absolute",
        left: x1,
        top: y1,
        width: Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2),
        height: 1,
        background: "rgba(255, 255, 255, 0.3)",
        transformOrigin: "0% 50%",
        transform: `rotate(${Math.atan2(y2 - y1, x2 - x1)}rad)`,
      }}
    />
  );
};

// Main Constellation Component
const Constellation = () => {
  const containerRef = useRef(null);
  const stars = useRef(
    Array.from({ length: NUM_STARS }, () => ({
      x: useMotionValue(Math.random() * window.innerWidth),
      y: useMotionValue(Math.random() * window.innerHeight),
      size: Math.random() * 3 + 2, // Random size between 2 and 5
    }))
  );

  // Function to animate stars
  const animateStars = () => {
    stars.current.forEach((star) => {
      animate(star.x, Math.random() * window.innerWidth, {
        duration: Math.random() * 5 + 5, // Random duration between 5 and 10 seconds
        repeat: Infinity,
        repeatType: "mirror",
        ease: "linear",
      });
      animate(star.y, Math.random() * window.innerHeight, {
        duration: Math.random() * 5 + 5,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "linear",
      });
    });
  };

  useEffect(() => {
    animateStars();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Render stars */}
      {stars.current.map((star, index) => (
        <Star key={index} x={star.x} y={star.y} size={star.size} />
      ))}

      {/* Render lines between stars */}
      {stars.current.map((star1, index1) =>
        stars.current.slice(index1 + 1).map((star2, index2) => (
          <ConstellationLine
            key={`${index1}-${index2}`}
            x1={star1.x}
            y1={star1.y}
            x2={star2.x}
            y2={star2.y}
          />
        ))
      )}
    </div>
  );
};

export default Constellation;