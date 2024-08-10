import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

function ViewEmergencyContacts({ contacts }: any) {
  console.log("Contacts: ", contacts);
  return (
    <div className="flex w-full justify-around flex-wrap">
      {contacts.length <= 0 && (
        <p className="p-2 border rounded-sm text-muted-foreground">
          Either you haven't filled the form, our you don't have emergency
          contacts
        </p>
      )}
      {contacts.length > 0 &&
        contacts.map((contact: any, key: number) => (
          <Card className="max-w-[280px] w-full" key={key}>
            <CardHeader>
              <CardTitle>{contact?.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Link
                href={`mailto:${contact?.email}`}
                className="underline underline-offset-8"
              >
                {contact?.email}
              </Link>
              <Link
                href={`tel:${contact?.phone}`}
                className="underline underline-offset-8"
              >
                {contact?.phone}
              </Link>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}

export default ViewEmergencyContacts;
