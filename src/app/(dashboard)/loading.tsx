"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-1.5 pointer-events-none">
      {/* High-performance subtle linear progress */}
      <div 
        className="h-full bg-gradient-to-r from-transparent via-[#86d2e5] to-transparent shadow-[0_0_15px_rgba(134,210,229,0.8)]" 
        style={{ 
          width: '40%', 
          animation: 'progress 1.5s infinite linear' 
        }}
      />
      
      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
}
