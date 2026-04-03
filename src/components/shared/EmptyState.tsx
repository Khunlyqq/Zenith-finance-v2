"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({ 
  title, 
  description, 
  actionLabel, 
  onAction,
  icon 
}: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="relative mb-8">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-[#86d2e5]/10 blur-[100px] rounded-full scale-150" />
        
        <div className="relative w-64 h-64 md:w-80 md:h-80 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <Image
            src="/images/empty-sad.png"
            alt="Data Kosong"
            fill
            className="object-contain drop-shadow-[0_0_20px_rgba(134,210,229,0.15)]"
          />
        </div>
      </div>

      <div className="max-w-md space-y-4 relative z-10">
        <h3 className="text-3xl font-black font-headline tracking-tighter text-[#e0e3e4]">
          {title}
        </h3>
        <p className="text-[#899295] font-medium leading-relaxed">
          {description}
        </p>

        {actionLabel && onAction && (
          <div className="pt-6">
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 bg-gradient-to-br from-[#86d2e5] to-[#006778] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              {icon || <Plus size={18} />}
              {actionLabel}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
