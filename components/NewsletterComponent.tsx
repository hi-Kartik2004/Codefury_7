"use client";
import React from "react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";

function NewsletterComponent({ locations }: any) {
  const [filteredLocations, setFilteredLocations] = React.useState<any[]>([]);
  const [selectedType, setSelectedType] = React.useState<string>("all");

  React.useEffect(() => {
    // Filter locations based on selected type
    if (selectedType === "all") {
      setFilteredLocations(locations);
    } else {
      setFilteredLocations(
        locations.filter((loc: any) => loc.type === selectedType)
      );
    }
  }, [selectedType, locations]);

  if (locations.length === 0) {
    return <div>Everything seems fine around you!</div>;
  }

  return (
    <div className="container">
      <h1 className="text-3xl font-semibold">Events Nearby</h1>
      <p className="text-muted-foreground">
        Check out the events happening near you
      </p>

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

      <div className="flex justify-around flex-wrap items-center gap-4 mt-10">
        {filteredLocations.map((location: any, index: number) => (
          <Card key={index} className="max-w-[300px] w-full">
            <CardHeader>
              <Badge>
                {location.type.charAt(0).toUpperCase() + location.type.slice(1)}{" "}
                Event
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <CardDescription>
                Approx Distance: {location?.distance?.toFixed(2)} km
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
                    <div className="flex w-full justify-around items-center flex-wrap my-2">
                      <Link
                        href={location.read_url}
                        target="_blank"
                        className="underline underline-offset-8"
                      >
                        Read more
                      </Link>
                      <div>
                        <Link
                          href={`https://www.google.com/maps/dir/${location.lat},${location.long}`}
                          target="_blank"
                          className="underline underline-offset-8"
                        >
                          Route
                        </Link>
                      </div>
                    </div>
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
                          <Button variant="outline" className="text-white mt-2">
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
      </div>
    </div>
  );
}

export default NewsletterComponent;
