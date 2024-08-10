import { createSupabaseServer } from "@/lib/supabase/server";

export async function getUserReportedPoints() {
  "use server";
  const supabase = createSupabaseServer();
  const { data, error } = await supabase
    .from("userIncidentLocations")
    .select("*");
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

export async function getNewsReportedPoints() {
  "use server";
  const supabase = createSupabaseServer();
  const { data, error } = await supabase
    .from("newsIncidentLocations")
    .select("*");
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

export async function getLostPeoplePoints() {
  "use server";
  const supabase = createSupabaseServer();
  const { data, error } = await supabase
    .from("lost_people")
    .select("*")
    .eq("found", false);
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

export async function getFoundPeoplePoints() {
  "use server";
  const supabase = createSupabaseServer();
  const { data, error } = await supabase
    .from("lost_people")
    .select("*")
    .eq("found", true);
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

export async function getAllPoints() {
  "use server";
  const userPoints = await getUserReportedPoints();
  const newsPoints = await getNewsReportedPoints();
  const lostPeoplePoints = await getLostPeoplePoints();
  const foundPeoplePoints = await getFoundPeoplePoints();
  return { userPoints, newsPoints, lostPeoplePoints, foundPeoplePoints };
}
