import { createSupabaseBrowser } from "@/lib/supabase/client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

function NotifyMe({ currentLocation }: any) {
  const [user, setUser] = useState<any>(null);
  const supabase = createSupabaseBrowser();
  async function getUserAuth() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  }

  React.useEffect(() => {
    getUserAuth();
  }, []);

  async function handelFormSubmit(e: any) {
    e.preventDefault();
    console.log("Form submitted");
    try {
      await supabase.from("weekly_newsletters").upsert([
        {
          email: user?.user_metadata?.email,
          lat: currentLocation.lat,
          long: currentLocation.lng,
        },
      ]);
    } catch (err) {
      console.error(err);
    }

    toast.success("Subscribed to weekly updates");
  }

  if (!currentLocation) {
    return <div>Location not provided</div>;
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Subscribe to Weekly Updates</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subscribe to the weekly newsletter</DialogTitle>
            <DialogDescription>
              And get to know whats happening around you!
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => handelFormSubmit(e)}
            className="w-full flex flex-col gap-2 flex-grow"
          >
            <Input type="email" disabled value={user?.user_metadata?.email} />
            <Button>Subscribe / modify my location for weekly updates</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NotifyMe;
