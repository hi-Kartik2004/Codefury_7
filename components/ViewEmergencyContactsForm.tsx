"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import ViewEmergencyContacts from "./ViewEmergencyContacts";
import { toast } from "sonner";

function ViewEmergencyContactsForm() {
  const [contacts, setContacts] = useState<any[]>([]); // Change 'any' to appropriate type if known
  const [error, setError] = useState<string | null>(null);

  async function getMatchingDetails(email: string, password: string) {
    const supabase = createSupabaseBrowser();

    // Check if the details match
    const { data: linkData, error: linkError } = await supabase
      .from("emergencyContactsLink")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single(); // Use .single() if you expect only one match

    if (linkError || !linkData) {
      toast.error("Invalid email or DOB");
      setError("Invalid email or DOB");
      return;
    }

    // Fetch emergency contacts if the details match
    const { data: contactsData, error: contactsError } = await supabase
      .from("emergencyContacts")
      .select("*")
      .eq("user_email", email);
    if (contactsError) {
      setError("Failed to fetch emergency contacts");
      return;
    }

    setContacts(contactsData || []);
    setError(null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    };

    getMatchingDetails(formData.email, formData.password);
  }

  return (
    <div className="container flex gap-4 w-full flex-wrap justify-around">
      <Card className="max-w-[400px] w-full">
        <CardHeader>
          <CardTitle>Get Your Emergency Contacts</CardTitle>
          <CardDescription>
            Enter your email and password to retrieve your emergency contacts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              name="email"
              placeholder="Enter your email"
              type="email"
              required
            />
            <Input
              name="password"
              placeholder="Enter your DOB"
              type="password"
              required
            />
            <Button type="submit">Submit</Button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </CardContent>
      </Card>
      <div className="max-w-[800px] w-full">
        <h3 className="text-center underline underline-offset-8 text-3xl mb-10">
          Emergency Contacts
        </h3>
        <ViewEmergencyContacts contacts={contacts} />
      </div>
    </div>
  );
}

export default ViewEmergencyContactsForm;
