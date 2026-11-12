'use client'

import React from "react";
import { Database } from "lucide-react";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  width = 72,
  height = 72,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-md ${className}`}
      style={{ width, height }}
    >
      <Database
        style={{ width: Math.round(width * 0.55), height: Math.round(height * 0.55) }}
        strokeWidth={2.2}
      />
    </div>
  );
};

export default Logo;
