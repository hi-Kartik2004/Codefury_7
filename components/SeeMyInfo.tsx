import { createSupabaseBrowser } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

function SeeMyInfo() {
  const [myReports, setMyReports] = useState<any>([]);
  const supabase = createSupabaseBrowser();

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let resp = await supabase
      .from("userIncidentLocations")
      .select("*")
      .eq("email", user?.user_metadata?.email);

    console.log("myreports :", resp);
    setMyReports(resp.data);
  }

  async function handleRemove(reportId: any) {
    let { error } = await supabase
      .from("userIncidentLocations")
      .delete()
      .eq("id", reportId);
    if (error) {
      console.error(error);
      return;
    }
    setMyReports(myReports.filter((report: any) => report.id !== reportId));
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="flex flex-wrap justify-around gap-4 overflow-auto max-h-screen items-center">
      {myReports.map((report: any) => (
        <Card key={report.id} className="max-w-[290px] w-full">
          <CardHeader className="flex flex-col gap-2">
            <CardTitle>Reported by: {report.full_name}</CardTitle>
            <Badge>{report?.created_at}</Badge>
            <img
              src={report.picture_url}
              alt={"image for incident"}
              className="w-full"
            />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button variant={"secondary"} asChild>
              <Link
                href={`https://www.google.com/maps?q=${report?.lat},${report?.long}`}
                target="_blank" // Open in a new tab
                rel="noopener noreferrer"
              >
                View Location
              </Link>
            </Button>
            <Button
              variant={"destructive"}
              className="w-full"
              onClick={() => handleRemove(report?.id)}
            >
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default SeeMyInfo;
