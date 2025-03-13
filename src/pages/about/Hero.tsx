import React, { useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Logo } from "../../components/Logo";
import { Button } from "../../components/Button";

// import Globe from "./wireframe-globe.svg";

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
        background: "white", // White dots
        boxShadow: "0 0 8px rgba(255, 255, 255, 0.8)", // Subtle glow for depth
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
        background: "rgba(255, 255, 255, 0.3)", // White lines with transparency
        transformOrigin: "0% 50%",
        transform: `rotate(${Math.atan2(y2 - y1, x2 - x1)}rad)`,
      }}
    />
  );
};

// Constellation Component
const Constellation = () => {
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
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex: 0, // Ensure it stays behind the hero content
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

// Hero Component with Constellation Background
export default function AboutHero() { 
    return (
      <div
        className="hero-section flex flex-col space-between h-screen px-20 relative justify-center items-center gap-15"
        style={{ overflow: "hidden", background: "#0a0a0a" }} // Dark background
      >
        {/* Constellation Background */}
        <Constellation />
        <img src="/smartstart-favicon-white.svg" alt="logo" className="h-30" />
          <h1 className="text-6xl inter-bold text-white z-10">
            Powerful <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">Market Insights</span>, Simplified
          </h1>
          <p className="text-2xl inter text-white z-10">
            SmartStart is your AI-Powered Commodity Analyst
          </p>
          {/* <button className="z-10 bg-white px-3 py-2 inter rounded-md">Try a demo</button> */}
          <Button color="white" className="z-10">Try a demo</Button>
      </div>
    );
  }
  