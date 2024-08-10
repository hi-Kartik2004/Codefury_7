import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = createSupabaseServer();

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
    } else {
      return Response.json({
        success: true,
      });
    }
  } catch (err) {
    console.error(err);
  }

  return Response.json({
    success: false,
    message: "Signout end point called",
  });
}
