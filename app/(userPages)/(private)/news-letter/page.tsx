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
      .eq("email", user?.user_metadata?.email)
      .single();

    dataJson = data;
    console.log(dataJson);
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="pt-24">
      <NewsletterComponent locations={dataJson?.resp} />
    </div>
  );
}

export default NewsLetterView;
