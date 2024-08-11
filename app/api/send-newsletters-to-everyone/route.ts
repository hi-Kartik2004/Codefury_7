import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = createSupabaseServer();
  let data: any[] = [];

  try {
    // Fetch records from the database
    const { data: fetchedData, error } = await supabase
      .from("weekly_newsletters")
      .select("*");

    if (error) {
      console.error("Error fetching data:", error.message);
      return new Response(
        JSON.stringify({ success: false, message: "Error fetching data" }),
        { status: 500 }
      );
    }

    // Filter records based on the criteria
    data = fetchedData.filter(
      (ele: any) =>
        ele.email &&
        ele.lat &&
        ele.long &&
        ele.lat !== 0 &&
        ele.long !== 0 &&
        (new Date().getTime() - new Date(ele.updated_at).getTime()) /
          (1000 * 60 * 60 * 24) >
          7
    );

    if (data.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No records found to send newsletters to",
        }),
        { status: 200 }
      );
    }

    const emails: any[] = [];
    // Send newsletters
    await Promise.all(
      data.map(async (ele: any) => {
        const currentLocation = {
          lat: ele.lat,
          lng: ele.long,
        };

        const options: any = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentLocation),
        };

        try {
          const resp = await fetch(
            `${process.env.NEXT_PUBLIC_DOMAIN}/api/get-info-for-newsletters`,
            options
          );

          if (!resp.ok) {
            throw new Error(`Failed to send newsletter to ${ele.email}`);
          }

          //   await sendEmail(ele.email, await resp.json());
          const options2: any = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: ele.email, data: await resp.json() }),
          };

          await fetch(
            `${process.env.NEXT_PUBLIC_DOMANIN}/api/send-email`,
            options2
          );

          // Update the record in the database
          const { error: updateError } = await supabase
            .from("weekly_newsletters")
            .update({ updated_at: new Date().toISOString() })
            .eq("email", ele.email);

          if (error) {
            throw error;
          }

          emails.push(ele.email);
        } catch (err) {
          console.error(`Error sending email to ${ele.email}:`, err);
        }
      })
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Newsletters sent successfully",
        emails: emails,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error processing request:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Error processing request" }),
      { status: 500 }
    );
  }
}
