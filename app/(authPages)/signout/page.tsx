"use client";
import { useRouter, useSearchParams } from "next/navigation";

import ClientSignout from "@/utils/client-hooks/clientSignout";
import { toast } from "sonner";

function ServerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const signout = ClientSignout(next);
  signout();
  toast.success("Signout successful");
  router.push(next);
}

export default ServerPage;
