import React from 'react';

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`${className} relative`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Quill Pen */}
        <path
          d="M20 80 L25 75 L35 85 L75 45 L80 50 L40 90 L20 80Z"
          fill="currentColor"
          className="text-amber-600"
          opacity="0.8"
        />
        <path
          d="M75 45 L85 35 L90 40 L80 50 L75 45Z"
          fill="currentColor"
          className="text-amber-700"
        />
        
        {/* Raven Silhouette */}
        <path
          d="M45 25 C50 20, 60 20, 65 25 C70 30, 70 35, 68 40 C66 35, 62 32, 60 35 C58 38, 60 42, 65 45 C70 48, 75 50, 75 55 C75 60, 70 62, 65 60 C60 58, 55 55, 52 50 C50 45, 48 40, 45 35 C42 30, 43 27, 45 25Z"
          fill="currentColor"
          className="text-slate-800"
        />
        
        {/* Raven's Eye */}
        <circle
          cx="58"
          cy="32"
          r="2"
          fill="currentColor"
          className="text-amber-500"
        />
        
        {/* Ink Drop */}
        <circle
          cx="30"
          cy="82"
          r="2"
          fill="currentColor"
          className="text-slate-600"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}