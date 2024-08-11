import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createSupabaseServer();
  const data = await request.json();
  const currentLocation = data.currentLocation || { 22: 79 };

  const R = 6371; // Radius of the Earth in kilometers

  // Function to calculate distance using Haversine formula
  function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
  }

  // Function to fetch incident locations with distance
  async function getIncidentLocations(
    currentLocation: {
      lat: number;
      lng: number;
    },
    type: string
  ) {
    let { data, error }: any = await supabase
      .from(type !== "lost" ? `${type}IncidentLocations` : "lost_people")
      .select("*");

    if (type === "lost") {
      data = data?.filter((ele: any) => ele.found === false);
    }

    if (error) {
      console.error(`Error fetching ${type} incident locations`, error.message);
      return [];
    }

    // Add distance to each location
    const locationsWithDistance = data.map((location: any) => {
      const distance = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        location.lat,
        location.long
      );
      return { ...location, distance, type };
    });

    return locationsWithDistance;
  }

  // Function to get all incident locations
  async function getAllIncidentLocations(currentLocation: {
    lat: number;
    lng: number;
  }) {
    const newsLocations = await getIncidentLocations(currentLocation, "news");
    const userLocations = await getIncidentLocations(currentLocation, "user");
    const lostLocations = await getIncidentLocations(currentLocation, "lost");
    const allLocations = [...newsLocations, ...userLocations, ...lostLocations];
    allLocations.sort((a: any, b: any) => a.distance - b.distance);
    return allLocations;
  }

  let allLocations: any[] = [];
  try {
    allLocations = await getAllIncidentLocations(currentLocation);
  } catch (err) {
    console.error(err);
  }

  return Response.json({
    success: true,
    data: allLocations,
  });
}
