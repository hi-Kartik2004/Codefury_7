"use client";

import { useRouter } from "next/navigation";
import React from "react";

function ClientSignout(redirectUrl: string) {
  const router = useRouter();
  async function Signout() {
    try {
      const resp = await fetch("/api/signout");
      const data = await resp.json();
      if (data.success) {
        router.push(redirectUrl);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return Signout;
}

export default ClientSignout;
