"use client";

import React from "react";

interface JaitraLogoProps {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
}

export default function JaitraLogo({ variant = "dark", size = "md" }: JaitraLogoProps) {
  const isDark = variant === "dark";

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className="flex flex-col">
        {/* Top Sub-branding: Praneeth + KKR'S PRANAV */}
        <div className="flex flex-col items-end pr-1 -mb-1">
          <div className="flex items-center gap-1">
            <span className="text-[11px] sm:text-[12px] font-extrabold tracking-tight text-[#e53935] font-sans">
              Praneeth
            </span>
            {/* Praneeth emblem: stylized figure with circle */}
            <svg className="w-2.5 h-2.5 text-[#e53935]" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="7" r="4" />
              <path d="M12 13c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5z" opacity="0.8" />
            </svg>
          </div>
          <span className={`text-[8px] sm:text-[9px] font-black tracking-widest ${isDark ? "text-sky-300/80" : "text-[#004b9e]"} -mt-0.5`}>
            KKR&apos;S PRANAV
          </span>
        </div>

        {/* Main Brand Name: jaitra with skyscraper tower as 'i' */}
        <div className="flex items-end font-black tracking-tight leading-none">
          {/* 'j' */}
          <span className={`text-3xl sm:text-4xl font-black ${isDark ? "text-white" : "text-[#004b9e]"} font-sans -mr-0.5`}>
            j
          </span>

          {/* 'a' */}
          <span className={`text-3xl sm:text-4xl font-black ${isDark ? "text-white" : "text-[#004b9e]"} font-sans -mr-0.5`}>
            a
          </span>

          {/* 'i' as Twin Skyscraper High-Rise Towers */}
          <div className="relative inline-flex items-end justify-center mx-1 h-8 sm:h-9 w-4 sm:w-5">
            <svg
              className="w-full h-full drop-shadow-sm"
              viewBox="0 0 32 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Back Tall Tower with Slanted Roof */}
              <path
                d="M4 14L16 6V48H4V14Z"
                fill="url(#tower-grad-1)"
              />
              {/* Vertical Glass Reflections on Tall Tower */}
              <line x1="8" y1="14" x2="8" y2="48" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.7" />
              <line x1="12" y1="10" x2="12" y2="48" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.5" />
              
              {/* Front Secondary Tower with Slanted Roof */}
              <path
                d="M14 22L28 14V48H14V22Z"
                fill="url(#tower-grad-2)"
              />
              {/* Front Tower Glass Facets */}
              <line x1="18" y1="22" x2="18" y2="48" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.8" />
              <line x1="23" y1="18" x2="23" y2="48" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.6" />

              {/* Tower Gradients */}
              <defs>
                <linearGradient id="tower-grad-1" x1="4" y1="6" x2="16" y2="48" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38bdf8" />
                  <stop offset="0.4" stopColor="#0284c7" />
                  <stop offset="1" stopColor="#034694" />
                </linearGradient>
                <linearGradient id="tower-grad-2" x1="14" y1="14" x2="28" y2="48" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7dd3fc" />
                  <stop offset="0.5" stopColor="#38bdf8" />
                  <stop offset="1" stopColor="#0c4a9e" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* 'tra' */}
          <span className={`text-3xl sm:text-4xl font-black ${isDark ? "text-sky-400" : "text-[#004b9e]"} font-sans`}>
            tra
          </span>
        </div>
      </div>
    </div>
  );
}
