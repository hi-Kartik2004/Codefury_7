"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReloadIcon } from "@radix-ui/react-icons";
import { TabsList } from "@radix-ui/react-tabs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Map } from "../Map";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsTrigger } from "../ui/tabs";
import NearByEvents from "./nearby-events";
import NotifyMe from "../NotifyMe";

export default function MapDashboard({ searchParams }: any) {
  const [newsReportedPoints, setNewsReportedPoints] = useState<any>([]);
  const [userReportedPoints, setUserReportedPoints] = useState<any>([]);
  const [lostPeopleReportedPoints, setLostPeopleReportedPoints] = useState<any>(
    []
  );
  const [foundPeopleReportedPoints, setFoundPeopleReportedPoints] =
    useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterByName, setFilterByName] = useState<boolean>(false);
  const [findMissingPerson, setFindMissingPerson] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    async function fetchData() {
      let data1 = [],
        data2 = [],
        data3 = [],
        data4 = [];

      if (selectedCategory === "news-points") {
        data1 = await fetch("api/map-points?category=news-points").then((res) =>
          res.json()
        );
      } else if (selectedCategory === "user-points") {
        data2 = await fetch("api/map-points?category=user-points").then((res) =>
          res.json()
        );
      } else if (selectedCategory === "lost-people") {
        data3 = await fetch("api/map-points?category=lost-people").then((res) =>
          res.json()
        );
      } else if (selectedCategory === "found-people") {
        data4 = await fetch("api/map-points?category=found-people").then(
          (res) => res.json()
        );
      } else {
        data1 = await fetch("api/map-points?category=news-points").then((res) =>
          res.json()
        );
        data2 = await fetch("api/map-points?category=user-points").then((res) =>
          res.json()
        );
        data3 = await fetch("api/map-points?category=lost-people").then((res) =>
          res.json()
        );
        data4 = await fetch("api/map-points?category=found-people").then(
          (res) => res.json()
        );
      }

      setNewsReportedPoints(data1);
      setUserReportedPoints(data2);
      setLostPeopleReportedPoints(data3);
      setFoundPeopleReportedPoints(data4);
    }

    fetchData();
  }, [selectedCategory]);

  const handleSearch = () => {
    let filteredNewsPoints = newsReportedPoints;
    let filteredUserPoints = userReportedPoints;
    let filteredLostPeoplePoints = lostPeopleReportedPoints;
    let filteredFoundPeoplePoints = foundPeopleReportedPoints;

    if (filterByName) {
      filteredNewsPoints = newsReportedPoints.filter((point: any) =>
        point?.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      filteredUserPoints = userReportedPoints.filter((point: any) =>
        point?.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      filteredLostPeoplePoints = lostPeopleReportedPoints.filter((point: any) =>
        point?.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      filteredFoundPeoplePoints = foundPeopleReportedPoints.filter(
        (point: any) =>
          point?.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (findMissingPerson) {
      filteredLostPeoplePoints = lostPeopleReportedPoints.filter((point: any) =>
        point.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Update state with filtered points
    setNewsReportedPoints(filteredNewsPoints);
    setUserReportedPoints(filteredUserPoints);
    setLostPeopleReportedPoints(filteredLostPeoplePoints);
    setFoundPeopleReportedPoints(filteredFoundPeoplePoints);

    console.log("Search for:", searchQuery);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  async function handleGetCoordinates(e: any) {
    e.preventDefault();
    const location = e.target[0].value;
    const resp =
      await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${location}&days=1&aqi=no&alerts=yes
`);
    const data = await resp.json();
    console.log("Weather data", data);
    setCurrentLocation({ lat: data?.location.lat, lng: data?.location.lon });
    toast.success("Location updated successfully");
  }

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 bg-muted">
        <Map
          newsReportedPoints={newsReportedPoints}
          userReportedPoints={userReportedPoints}
          lostPeopleReportedPoints={lostPeopleReportedPoints}
          foundPeopleReportedPoints={foundPeopleReportedPoints}
          mylocation={currentLocation}
          center={
            currentLocation
              ? [currentLocation.lat, currentLocation.lng]
              : [38.9637, 35.2433]
          }
        />
      </div>
      <Tabs defaultValue="current" className="max-w-[300px] w-full rounded-sm">
        <TabsList className="grid w-full grid-cols-2 border rounded-sm">
          <TabsTrigger
            value="current"
            className="bg-gray-900 text-white py-2 px-4 rounded-t-lg peer-checked:bg-blue-700 peer-checked:text-white"
          >
            <input
              type="radio"
              name="tabs"
              value="current"
              className="peer sr-only"
            />
            Current
          </TabsTrigger>
          <TabsTrigger
            value="future"
            className="bg-gray-900 text-white py-2 px-4 rounded-t-lg peer-checked:bg-blue-700 peer-checked:text-white"
          >
            <input
              type="radio"
              name="tabs"
              value="future"
              className="peer sr-only"
            />
            Future
          </TabsTrigger>
        </TabsList>
        <TabsContent value="current">
          <div className="flex flex-col gap-4 bg-background p-6 sm:p-8">
            <h1 className="text-semibold underline-offset-8 underline">
              Current
            </h1>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="search">Search by Person</Label>
                <Input
                  id="search"
                  placeholder="Enter the name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    id="filterByName"
                    checked={filterByName}
                    onChange={() => setFilterByName(!filterByName)}
                  />
                  <Label htmlFor="filterByName">Filter by reporter Name</Label>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    id="findMissingPerson"
                    checked={findMissingPerson}
                    onChange={() => setFindMissingPerson(!findMissingPerson)}
                  />
                  <Label htmlFor="findMissingPerson">Find Missing Person</Label>
                </div>
                <Button onClick={handleSearch}>Search</Button>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setSelectedCategory(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Points</SelectItem>
                    <SelectItem value="news-points">News Points</SelectItem>
                    <SelectItem value="user-points">
                      User Reported Points
                    </SelectItem>
                    <SelectItem value="lost-people">Lost People</SelectItem>
                    <SelectItem value="found-people">Found People</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator className="my-4" />
              <Button onClick={handleGetCurrentLocation}>
                Mark my Current Location
              </Button>
              <Button
                variant={"outline"}
                onClick={() => window.location.reload()}
                className="flex gap-2 items-center"
              >
                <ReloadIcon /> Refresh
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="future">
          <div className="flex flex-col gap-4 bg-background p-6 sm:p-8">
            <h1>Future</h1>
            <div className="grid gap-4">
              <form
                className="grid gap-2"
                onSubmit={(e) => handleGetCoordinates(e)}
              >
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter a location" />
                <Button type="submit">Replace my location</Button>
              </form>
              <div>
                <Button
                  onClick={handleGetCurrentLocation}
                  className="w-full"
                  variant={"secondary"}
                >
                  Mark my Current Location
                </Button>
              </div>
              <Separator className="my-4" />
              <NearByEvents currentLocation={currentLocation} />
              <Separator className="my-4" />
              <NotifyMe currentLocation={currentLocation} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CalendarDaysIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}
