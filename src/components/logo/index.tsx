'use client'

import React from "react";
import logo from "../../../public/logo.png";

const Logo: React.FC = () => {
  return (
    <div className="px-4 py-2 rounded-lg bg-white flex items-center justify-center w-fit outfit shadow-md">
      <img alt="Logo" src={logo.src} className="w-18" />
    </div>
  );
};

export default Logo;
