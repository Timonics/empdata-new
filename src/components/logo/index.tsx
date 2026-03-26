'use client'

import React from "react";
import Image from "next/image";
import logo from "../../../public/aandg.png";

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
      className={`px-4 py-2 rounded-lg bg-white flex items-center justify-center w-fit outfit shadow-md ${className}`}
    >
      <Image
        src={logo}
        alt="Logo"
        width={width}
        height={height}
        priority
      />
    </div>
  );
};

export default Logo;