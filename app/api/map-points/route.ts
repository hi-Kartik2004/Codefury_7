import {
  getAllPoints,
  getFoundPeoplePoints,
  getLostPeoplePoints,
  getNewsReportedPoints,
  getUserReportedPoints,
} from "@/utils/server/getAllPoints";

export async function GET(request: Request) {
  // search for user reported points
  const requestedURL = new URL(request.url);
  const searchParams = requestedURL.searchParams;
  const category = searchParams.get("category");

  // Fetch data based on category
  if (category === "user-points") {
    const data = await getUserReportedPoints();
    return Response.json(data);
  } else if (category === "news-points") {
    const data = await getNewsReportedPoints();
    return Response.json(data);
  } else if (category === "lost-people") {
    const data = await getLostPeoplePoints();
    return Response.json(data);
  } else if (category === "found-people") {
    const data = await getFoundPeoplePoints();
    return Response.json(data);
  } else {
    return Response.json(getAllPoints());
  }
}
