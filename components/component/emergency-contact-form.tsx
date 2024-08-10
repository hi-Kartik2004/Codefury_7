"use client";
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
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { EyeIcon } from "lucide-react";

// Define the type for the contact
interface Contact {
  id: number | null;
  name: string;
  phone: string;
  email: string;
}

export function EmergencyContactForm() {
  const supabase = createSupabaseBrowser();
  const [contacts, setContacts] = useState<Contact[]>([
    { id: null, name: "", phone: "", email: "" },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [passwordSubmitted, setPasswordSubmitted] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Fetch contacts when the component mounts
  useEffect(() => {
    const fetchContacts = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: contactsData, error } = await supabase
        .from("emergencyContacts")
        .select("*")
        .eq("user_id", user?.id);

      if (error) {
        console.error("Error fetching contacts:", error.message);
        return;
      }

      if (contactsData && contactsData.length > 0) {
        setContacts(contactsData);
      }

      // Fetch password from the emergencyContactsLink table
      const { data: linkData, error: linkError } = await supabase
        .from("emergencyContactsLink")
        .select("password")
        .eq("user_id", user?.id)
        .single();

      if (linkError && linkError.code !== "PGRST116") {
        console.error("Error fetching password:", linkError.message);
      }

      if (linkData) {
        setPassword(linkData.password);
        setPasswordSubmitted(true);
      }
    };

    fetchContacts();
  }, [supabase]);

  const handleInputChange = (
    index: number,
    field: keyof Contact,
    value: string
  ) => {
    const newContacts = [...contacts];
    newContacts[index] = {
      ...newContacts[index],
      [field]: value,
    };
    setContacts(newContacts);
  };

  const handleAddContact = () => {
    setContacts([...contacts, { id: null, name: "", phone: "", email: "" }]);
  };

  const handleSaveContacts = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    try {
      // Separate new and existing contacts
      const newContacts = contacts.filter((contact) => !contact.id);
      const existingContacts = contacts.filter((contact) => contact.id);

      // Insert new contacts
      if (newContacts.length > 0) {
        const { error: insertError } = await supabase
          .from("emergencyContacts")
          .insert(
            newContacts.map((contact) => ({
              user_id: user?.id,
              name: contact.name,
              phone: contact.phone,
              email: contact.email,
              user_email: user?.user_metadata?.email,
            }))
          );

        if (insertError) throw insertError;
      }

      // Update existing contacts
      for (const contact of existingContacts) {
        const { error: updateError } = await supabase
          .from("emergencyContacts")
          .update({
            name: contact.name,
            phone: contact.phone,
            email: contact.email,
          })
          .eq("id", contact.id);

        if (updateError) throw updateError;
      }

      // Insert password and email into emergencyContactsLink if not already submitted
      if (!passwordSubmitted) {
        const { error: linkError } = await supabase
          .from("emergencyContactsLink")
          .insert({
            user_id: user?.id,
            email: contacts[0]?.email, // Assuming the first contact's email is used
            password: password,
          });

        if (linkError) throw linkError;

        setPasswordSubmitted(true);
        alert("Contacts and password saved successfully!");
      } else {
        alert("Contacts saved successfully!");
      }
    } catch (error: any) {
      console.error("Error saving contacts:", error.message);
      alert("Failed to save contacts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (index: number) => {
    const contact = contacts[index];
    if (contact.id) {
      // If the contact exists in the database, delete it
      try {
        const { error } = await supabase
          .from("emergencyContacts")
          .delete()
          .eq("id", contact.id);

        if (error) throw error;

        alert("Contact deleted successfully!");
      } catch (error: any) {
        console.error("Error deleting contact:", error.message);
        alert("Failed to delete contact. Please try again.");
        return;
      }
    }

    // Remove the contact from the state
    const newContacts = contacts.filter((_, i) => i !== index);
    setContacts(newContacts);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Emergency Contacts</CardTitle>
        <CardDescription>
          Add the contact information for people we can reach in an emergency.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSaveContacts}>
          <div className="grid gap-4">
            {contacts.map((contact, index) => (
              <div className="grid grid-cols-3 gap-4" key={index}>
                <div className="space-y-2">
                  <Label htmlFor={`name-${index}`}>Name</Label>
                  <Input
                    id={`name-${index}`}
                    placeholder="John Doe"
                    value={contact.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`phone-${index}`}>Phone</Label>
                  <Input
                    id={`phone-${index}`}
                    type="tel"
                    placeholder="(123) 456-7890"
                    value={contact.phone}
                    onChange={(e) =>
                      handleInputChange(index, "phone", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`email-${index}`}>Email</Label>
                  <Input
                    id={`email-${index}`}
                    type="email"
                    placeholder="john@example.com"
                    value={contact.email}
                    onChange={(e) =>
                      handleInputChange(index, "email", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2 flex items-end">
                  <Button
                    variant="destructive"
                    type="button"
                    onClick={() => handleDeleteContact(index)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">DOB</Label>
            <div className="relative mb-2">
              <Input
                id="password"
                type={!showPassword ? "password" : "text"}
                placeholder="Enter a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={passwordSubmitted} // Disable the field if the password is already submitted
              />
              <EyeIcon
                className="absolute right-2 top-2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Enter your DOB, it would be usefull incase of emergencies.
            </p>
          </div>

          <Button type="button" onClick={handleAddContact}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Another Contact
          </Button>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Contacts"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
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
