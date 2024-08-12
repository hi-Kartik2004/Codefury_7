"use client";
import React from "react";
import GoogleTranslator from "./GoogleTranslator";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { SiGoogletranslate } from "react-icons/si";

function Translator() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SiGoogletranslate size={25} />
      </DialogTrigger>
      <DialogContent>
        <GoogleTranslator className="w-full flex flex-col gap-0" />
      </DialogContent>
    </Dialog>
  );
}

export default Translator;
