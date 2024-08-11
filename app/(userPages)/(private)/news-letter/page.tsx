import NewsletterComponent from "@/components/NewsletterComponent";
import { createSupabaseServer } from "@/lib/supabase/server";
import React from "react";

async function NewsLetterView() {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase?.auth?.getUser();

  let dataJson = [];
  try {
    const { data, error }: any = await supabase
      .from("weekly_newsletters")
      .select("resp")
      .eq("email", user?.user_metadata?.email);
    dataJson = JSON.parse(data);
  } catch (err) {
    console.error(err);
  }

  // convert json string into json
  return (
    <div>
      <NewsletterComponent locations={dataJson} />
    </div>
  );
}

export default NewsLetterView;
