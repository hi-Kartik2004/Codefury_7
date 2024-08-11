import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import Link from "next/link";
import { Badge } from "../ui/badge";

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
  const supabase = createSupabaseBrowser();

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

// Component to display nearby events
function NearByEvents({ currentLocation }: any) {
  const [locations, setLocations] = React.useState<any[]>([]);
  const [filteredLocations, setFilteredLocations] = React.useState<any[]>([]);
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchLocations() {
      try {
        // Fetch locations for all types
        const newsLocations = await getIncidentLocations(
          currentLocation,
          "news"
        );
        const userLocations = await getIncidentLocations(
          currentLocation,
          "user"
        );
        const lostLocations = await getIncidentLocations(
          currentLocation,
          "lost"
        );

        // Combine and sort all locations by distance
        const allLocations = [
          ...newsLocations,
          ...userLocations,
          ...lostLocations,
        ];
        allLocations.sort((a: any, b: any) => a.distance - b.distance);

        setLocations(allLocations);
        setFilteredLocations(allLocations);
      } catch (err) {
        setError("Failed to fetch locations.");
        console.error(err);
      }
    }

    if (currentLocation) {
      fetchLocations();
    }
  }, [currentLocation]);

  React.useEffect(() => {
    // Filter locations based on selected type
    if (selectedType === "all") {
      setFilteredLocations(locations);
    } else {
      setFilteredLocations(
        locations.filter((loc) => loc.type === selectedType)
      );
    }
  }, [selectedType, locations]);

  if (error) {
    return <div>{error}</div>;
  }

  if (locations.length === 0) {
    return <div>No events found or Location not provided</div>;
  }

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger>
          <Button variant={"outline"}>Checkout Nearby Events</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className={"max-h-screen overflow-auto"}>
          <AlertDialogHeader>
            <AlertDialogTitle>Events Nearby</AlertDialogTitle>
            <AlertDialogDescription>
              Check out the events happening near you
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mb-4">
            <label htmlFor="filter" className="mr-2">
              Filter by type:
            </label>
            <select
              id="filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="all">All</option>
              <option value="news">News</option>
              <option value="user">User</option>
              <option value="lost">Lost</option>
            </select>
          </div>
          {filteredLocations.slice(0, 6).map((location: any, index: number) => (
            <Card key={index}>
              <CardHeader>
                <Badge>
                  {location.type.charAt(0).toUpperCase() +
                    location.type.slice(1)}{" "}
                  Event
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <CardDescription>
                  Approx Distance: {location.distance.toFixed(2)} km
                </CardDescription>
                <ul>
                  <li>
                    Event Location:{" "}
                    <Link
                      href={`https://maps.google.com/?q=${location.lat},${location.long}`}
                    >
                      View on Map
                    </Link>
                  </li>
                  {location.type === "news" && (
                    <div>
                      <h1 className="text-2xl">
                        {location.population} might get people impacted
                      </h1>
                      <Link
                        href={location.read_url}
                        target="_blank"
                        className="underline underline-offset-8"
                      >
                        Read more
                      </Link>
                      <p className="text-muted-foreground text-sm mt-4">
                        {location.created_at}
                      </p>
                    </div>
                  )}
                  {location.type === "user" && (
                    <div>
                      <h1 className="text-2xl">
                        Reported By {location.full_name}
                      </h1>
                      <div className="flex flex-wrap w-full justify-between items-center mt-2">
                        <Link
                          href={`https://www.google.com/maps/dir/${location.lat},${location.long}`}
                          target="_blank"
                          className="underline underline-offset-8"
                        >
                          Route
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline">View Details</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="flex flex-col gap-4">
                            <div>
                              <h1 className="text-2xl">
                                Reported By {location.full_name}
                              </h1>
                              <img
                                src={location.picture_url}
                                alt="Picture of incident"
                                className="w-full max-w-[300px]"
                              />
                              <AlertDialogCancel asChild>
                                <Button variant="destructive">Close</Button>
                              </AlertDialogCancel>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <p className="text-muted-foreground mt-4">
                        {location.created_at}
                      </p>
                    </div>
                  )}
                  {location.type === "lost" && (
                    <div>
                      <Badge variant="destructive">Lost</Badge>
                      <h1 className="text-2xl">{location.name}'s lost</h1>
                      <p>Age: {location.age} years</p>
                      <div className="flex flex-wrap justify-around items-center w-full">
                        <Link
                          href={`https://www.google.com/maps/dir/${location.lat},${location.long}`}
                          target="_blank"
                          className="underline underline-offset-8"
                        >
                          Route
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="text-white mt-2"
                            >
                              View Details
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <div className="flex flex-col gap-2">
                              <h1 className="text-2xl">Message:</h1>
                              <p className="text-muted-foreground mt-2">
                                {location.message}
                              </p>
                              <img
                                src={location.picture}
                                alt="Picture of incident"
                                className="w-full max-w-[300px]"
                              />
                              <AlertDialogCancel asChild>
                                <Button variant="destructive">Close</Button>
                              </AlertDialogCancel>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>

                        <p className="text-muted-foreground mt-4 flex w-full flex-start ">
                          {location?.created_at}
                        </p>
                      </div>
                    </div>
                  )}
                </ul>
              </CardContent>
            </Card>
          ))}
          <AlertDialogCancel className="mt-10">Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default NearByEvents;
