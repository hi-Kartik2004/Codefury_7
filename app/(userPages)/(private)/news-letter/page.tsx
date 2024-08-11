import NewsletterComponent from "@/components/NewsletterComponent";
import { createSupabaseServer } from "@/lib/supabase/server";
import React from "react";

async function NewsLetterView() {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase?.auth?.getUser();

  const { data, error }: any = await supabase
    .from("weekly_newsletters")
    .select("resp")
    .eq("email", user?.user_metadata?.email);

  // convert json string into json
  const dataJson = JSON.parse(data);
  return (
    <div>
      <NewsletterComponent locations={dataJson} />
    </div>
  );
}

export default NewsLetterView;
