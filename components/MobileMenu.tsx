"use client";
import Link from "next/link";
import {
  Sheet,
  SheetClose,
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
import { Separator } from "./ui/separator";

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

        <Separator className="my-4" />

        <Link
          href="/news"
          className="text-sm font-medium transition-all hover:text-primary underline underline-offset-4 hover:underline-offset-8 duration-200"
          prefetch={false}
        >
          <SheetClose>News</SheetClose>
        </Link>
        <Link
          href="add-info"
          className="text-sm font-medium transition-all hover:text-primary underline underline-offset-4 hover:underline-offset-8 duration-200"
          prefetch={false}
        >
          <SheetClose>Report Emergency</SheetClose>
        </Link>
        <Link
          href="get-emergency-contacts"
          className="text-sm font-medium transition-all hover:text-primary underline underline-offset-4 hover:underline-offset-8 duration-200"
          prefetch={false}
        >
          <SheetClose>Get Emergency Contacts</SheetClose>
        </Link>
        <Link
          href="find-people"
          className="text-sm font-medium hover:text-primary underline underline-offset-4 hover:underline-offset-8 duration-200 transition-all"
          prefetch={false}
        >
          <SheetClose>Find People</SheetClose>
        </Link>
      </SheetContent>
    </Sheet>
  );
}

export default MobileMenu;
