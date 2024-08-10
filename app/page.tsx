import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-center text-5xl">Home</h1>
      <div className="flex justify-center w-full">
        <Button className="mt-10" asChild>
          <Link href="/signout?next=/">Signout</Link>
        </Button>
      </div>
    </main>
  );
}
