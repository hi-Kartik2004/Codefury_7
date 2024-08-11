"use client";
import React from "react";
import GoogleTranslator from "react-multilingual-content";

function Translator() {
  return (
    <div>
      <GoogleTranslator className="max-w-[150px] w-full" />
    </div>
  );
}

export default Translator;
