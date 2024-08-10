"use client";
import { useRouter, useSearchParams } from "next/navigation";

import ClientSignout from "@/utils/client-hooks/clientSignout";
import { toast } from "sonner";
import { Suspense } from "react";
import { revalidatePath } from "next/cache";

function HandleRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const signout = ClientSignout(next);
  signout();
  toast.success("Signout successful");
  router.push(next);
  return <div>Signing out...</div>;
}

function ServerPage() {
  return (
    <Suspense fallback={"Signing out..."}>
      <HandleRedirect />
    </Suspense>
  );
}

export default ServerPage;
