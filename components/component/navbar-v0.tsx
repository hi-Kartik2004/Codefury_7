import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createSupabaseServer } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "../ModeToggle";
import Translator from "../Translator";
import MobileMenu from "../MobileMenu";

export async function NavbarV0() {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let loggedIn = false;
  if (user) {
    loggedIn = true;
  }
  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <div className="flex md:hidden">
            <MobileMenu />
          </div>

          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <Image src="/logo.png" alt="Codefury 7" width={40} height={40} />
            <span className="">Aid-Grid</span>
          </Link>
        </div>

        {/* <div className="hidden md:flex "> heello</div> */}

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/news"
            className="text-sm font-medium transition-all hover:text-primary underline underline-offset-4 hover:underline-offset-8 duration-200"
            prefetch={false}
          >
            News
          </Link>
          <Link
            href="add-info"
            className="text-sm font-medium transition-all hover:text-primary underline underline-offset-4 hover:underline-offset-8 duration-200"
            prefetch={false}
          >
            Report Emergency
          </Link>
          <Link
            href="get-emergency-contacts"
            className="text-sm font-medium transition-all hover:text-primary underline underline-offset-4 hover:underline-offset-8 duration-200"
            prefetch={false}
          >
            Get Emergency Contacts
          </Link>
          <Link
            href="find-people"
            className="text-sm font-medium hover:text-primary underline underline-offset-4 hover:underline-offset-8 duration-200 transition-all"
            prefetch={false}
          >
            Find People
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {!loggedIn && (
            <Button
              className="md:inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              asChild
            >
              <Link href="/sign-in">Login</Link>
            </Button>
          )}
          {loggedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.user_metadata?.picture}
                      alt="User Avatar"
                    />
                    <AvatarFallback>
                      {user?.user_metadata?.full_name
                        ?.slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link
                    href="add-emergency-contacts"
                    className="flex items-center gap-2"
                    prefetch={false}
                  >
                    <span>Emergency Contacts</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-0">
                  <Button variant={"destructive"} className="w-full" asChild>
                    <Link
                      href="/signout?next=/"
                      className="flex items-center gap-2 w-full"
                      prefetch={false}
                    >
                      Sign out
                    </Link>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
