"use client";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Translator from "./Translator";
import GoogleTranslator from "./GoogleTranslator";

function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <HamburgerMenuIcon />
      </SheetTrigger>

      <SheetContent className="flex flex-col gap-4 items-center">
        <SheetHeader>
          <SheetTitle className="text-center">Menu</SheetTitle>
        </SheetHeader>

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

        <GoogleTranslator className="w-full max-w-[120px] flex flex-col gap-0" />
      </SheetContent>
    </Sheet>
  );
}

export default MobileMenu;
