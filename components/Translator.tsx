"use client";
import React from "react";
import GoogleTranslator from "./GoogleTranslator";

function Translator() {
  return (
    <div>
      <GoogleTranslator className="w-full max-w-[100px] flex flex-col gap-0" />
    </div>
  );
}

export default Translator;
