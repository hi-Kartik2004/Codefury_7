"use client";
import { Button } from "@/components/ui/button";
import React from "react";

function SendWeeklyEmails() {
  async function handleClick() {
    try {
      const resp = await fetch("/api/send-newsletters-to-everyone");
      const data = await resp.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div className="pt-28">
      <Button onClick={handleClick}>Send Newsletters</Button>
    </div>
  );
}

export default SendWeeklyEmails;
