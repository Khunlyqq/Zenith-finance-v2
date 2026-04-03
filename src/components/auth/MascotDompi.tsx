"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface MascotDompiProps {
  isPasswordFocused?: boolean;
}

export default function MascotDompi({ isPasswordFocused = false }: MascotDompiProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position relative to center of screen (-1 to 1)
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Smooth springs for tracking
  const springConfig = { damping: 20, stiffness: 100 };
  const pupilX = useSpring(0, springConfig);
  const pupilY = useSpring(0, springConfig);

  useEffect(() => {
    pupilX.set(mousePos.x * 12); // Move up to 12px horizontally
    pupilY.set(mousePos.y * 10); // Move up to 10px vertically
  }, [mousePos, pupilX, pupilY]);

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Glow Effect */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-48 h-48 bg-[#86d2e5] rounded-full blur-[60px]"
      />

      <motion.svg
        viewBox="0 0 200 200"
        className="w-full h-full relative z-10"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Shadow */}
        <ellipse cx="100" cy="185" rx="40" ry="10" fill="rgba(0,0,0,0.3)" />

        {/* Body */}
        <motion.path
          d="M40,100 C40,50 160,50 160,100 C160,160 40,160 40,100"
          fill="#1c2021"
          stroke="#86d2e5"
          strokeWidth="4"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Belly Gradient */}
        <circle cx="100" cy="115" r="35" fill="url(#bellyGrad)" opacity="0.1" />

        {/* Left Eye */}
        <g transform="translate(70, 90)">
          <circle r="22" fill="#e0e3e4" />
          <motion.circle
            r="10"
            fill="#101415"
            style={{ x: pupilX, y: pupilY }}
          />
          {/* Eye Lid (Mischievous) */}
          <motion.path
            d="M-25,-25 L25,-25 L25,0 Q0,-5 -25,0 Z"
            fill="#1c2021"
            animate={{ y: isPasswordFocused ? -5 : -30 }}
          />
        </g>

        {/* Right Eye */}
        <g transform="translate(130, 90)">
          <circle r="22" fill="#e0e3e4" />
          <motion.circle
            r="10"
            fill="#101415"
            style={{ x: pupilX, y: pupilY }}
          />
          {/* Eye Lid (Mischievous) */}
          <motion.path
            d="M-25,-25 L25,-25 L25,0 Q0,-5 -25,0 Z"
            fill="#1c2021"
            animate={{ y: isPasswordFocused ? -5 : -30 }}
          />
        </g>

        {/* Blinking Animation Layer */}
        <motion.path
          d="M45,85 L95,85 M105,85 L155,85"
          stroke="#1c2021"
          strokeWidth="0"
          animate={{ strokeWidth: [0, 40, 0] }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatDelay: 3,
            times: [0, 0.5, 1],
          }}
        />

        {/* Decorative Antennas */}
        <motion.path
          d="M85,55 Q80,35 65,30"
          fill="none"
          stroke="#86d2e5"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.path
          d="M115,55 Q120,35 135,30"
          fill="none"
          stroke="#86d2e5"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{ rotate: [5, -5, 5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <defs>
          <radialGradient id="bellyGrad">
            <stop offset="0%" stopColor="#86d2e5" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </motion.svg>
      
      {/* Small floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#86d2e5] rounded-full opacity-40"
            animate={{
                y: [0, -100],
                opacity: [0, 0.4, 0],
                x: [0, (i % 2 === 0 ? 20 : -20)],
            }}
            transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
            }}
            style={{
                bottom: "20%",
                left: `${20 + (i * 12)}%`
            }}
        />
      ))}
    </div>
  );
}
