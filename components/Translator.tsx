"use client";
import React from "react";
import GoogleTranslator from "./GoogleTranslator";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

function Translator() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Language</Button>
      </DialogTrigger>
      <DialogContent>
        <GoogleTranslator className="w-full max-w-[100px] flex flex-col gap-0" />
      </DialogContent>
    </Dialog>
  );
}

export default Translator;
