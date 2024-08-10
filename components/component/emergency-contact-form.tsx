/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/RNqdbWZUlRK
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function EmergencyContactForm() {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Emergency Contacts</CardTitle>
        <CardDescription>
          Add the contact information for people we can reach in an emergency.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name-1">Name</Label>
                <Input id="name-1" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone-1">Phone</Label>
                <Input id="phone-1" type="tel" placeholder="(123) 456-7890" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-1">Email</Label>
                <Input
                  id="email-1"
                  type="email"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name-2">Name</Label>
                <Input id="name-2" placeholder="Jane Smith" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone-2">Phone</Label>
                <Input id="phone-2" type="tel" placeholder="(987) 654-3210" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-2">Email</Label>
                <Input
                  id="email-2"
                  type="email"
                  placeholder="jane@example.com"
                />
              </div>
            </div>
          </div>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Another Contact
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full">
          Save Contacts
        </Button>
      </CardFooter>
    </Card>
  );
}

function PlusIcon(props: any) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
