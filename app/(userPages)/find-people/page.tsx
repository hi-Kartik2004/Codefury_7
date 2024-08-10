"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { CameraIcon, LocateIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const supabase = createSupabaseBrowser();

function FindPeople() {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [location, setLocation] = useState<{
    lat: number;
    long: number;
  } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [uploadingPhoto, setUploadingPhoto] = useState<boolean>(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [user, setUser] = useState<any | null>(null);
  const [lostPeople, setLostPeople] = useState<any[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<any | null>(null);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  async function getUser() {
    const { data: user, error } = await supabase.auth.getUser();
    if (error) {
      alert("Error fetching user:");
      return;
    }
    setUser(user);
    fetchLostPeople(user.user?.user_metadata?.email);
  }

  const [searchTerm, setSearchTerm] = useState("");

  async function fetchLostPeople(
    userEmail: string | undefined,
    searchTerm: string = ""
  ) {
    let query = supabase.from("lost_people").select("*").eq("found", false);

    if (userEmail) {
      query = query.eq("user_email", userEmail);
    }

    if (searchTerm) {
      query = query.ilike("name", `%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching lost people:", error);
      return;
    }

    setLostPeople(data);
  }

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    setIsFormValid(!!name && !!age && !!photoUrl && location !== null);
  }, [name, age, photoUrl, location]);

  // Add a useEffect to fetch all lost people if no user is logged in or on initial load
  useEffect(() => {
    if (!user?.user?.user_metadata?.email) {
      fetchLostPeople(undefined, searchTerm);
    }
  }, [user, searchTerm]);

  // Update fetchLostPeople to handle search term
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    fetchLostPeople(user?.user?.user_metadata?.email, e.target.value);
  };

  const handleLocationClick = () => {
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, long: longitude });
        setLoadingLocation(false);
        toast.success("Location fetched successfully");
      },
      (error) => {
        console.error("Error fetching location:", error);
        setLoadingLocation(false);
        toast.error("Failed to fetch location");
      }
    );
  };

  const handlePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      setPhoto(file);
      setUploadingPhoto(true);

      try {
        const timestamp = new Date().getTime();
        const fileExtension = file.name.split(".").pop();
        const uniqueFilename = `${timestamp}_${file.name}`;

        const { data, error } = await supabase.storage
          .from("userIncidentsPhotos")
          .upload(`public/${uniqueFilename}`, file);

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage
          .from("userIncidentsPhotos")
          .getPublicUrl(data.path);

        setPhotoUrl(publicUrlData.publicUrl);
        toast.success("Photo uploaded successfully");
      } catch (error) {
        console.error("Error uploading photo:", error);
        toast.error("Failed to upload photo");
      } finally {
        setUploadingPhoto(false);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      const { error: insertError } = await supabase.from("lost_people").insert({
        name,
        age,
        picture: photoUrl,
        lat: location?.lat,
        long: location?.long,
        message: message,
        user_email: user?.user?.user_metadata?.email,
      });

      if (insertError) {
        throw insertError;
      }

      toast.success("Details added successfully!");
      // Reset form
      setName("");
      setAge(null);
      setFile(null);
      setPhoto(null);
      setLocation(null);
      setPhotoUrl(null);

      fetchLostPeople(user?.user?.user_metadata?.email); // Refresh the lost people list
    } catch (error: any) {
      console.error("Error:", error.message);
      toast.error("Failed to add details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsFound = async (personId: number) => {
    setIsConfirming(true);
    if (window.confirm("Are you sure you want to mark this person as found?")) {
      try {
        const { error } = await supabase
          .from("lost_people")
          .update({ found: true })
          .eq("id", personId);

        if (error) throw error;

        toast.success("Marked as found successfully!");
        fetchLostPeople(user?.user?.user_metadata?.email); // Refresh the lost people list
      } catch (error) {
        console.error("Error updating person:", error);
        toast.error("Failed to mark as found.");
      } finally {
        setIsConfirming(false);
      }
    } else {
      setIsConfirming(false);
    }
  };

  return (
    <div className="pt-28 container">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-semibold">Find People</h2>
          <p className="mt-2 text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum,
            similique?
          </p>
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add +</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Fill the form</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Let others know where you are!
                </DialogDescription>
              </DialogHeader>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={age || ""}
                    onChange={(e) => setAge(parseInt(e.target.value, 10))}
                    placeholder="Enter age"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="photo">Photo</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="photo"
                      onChange={handlePhotoChange}
                      className="hidden"
                      disabled={uploadingPhoto}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("photo")?.click()}
                      disabled={uploadingPhoto}
                    >
                      {uploadingPhoto ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CameraIcon className="h-4 w-4 mr-2" />
                      )}
                      {uploadingPhoto ? "Uploading..." : "Upload Photo"}
                    </Button>
                    {photoUrl && (
                      <p className="text-sm text-green-600">Photo uploaded</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleLocationClick}
                    disabled={loadingLocation}
                  >
                    {loadingLocation ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <LocateIcon className="h-4 w-4 mr-2" />
                    )}
                    {loadingLocation
                      ? "Fetching location..."
                      : "Get my location"}
                  </Button>
                  {location && (
                    <p className="text-sm text-green-600">
                      Location: {location.lat.toFixed(6)},{" "}
                      {location.long.toFixed(6)}
                    </p>
                  )}
                </div>

                <div>
                  <Textarea
                    placeholder="Enter additional details"
                    name="message"
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <Button type="submit" disabled={!isFormValid || loading}>
                  {loading ? "Submitting..." : "Submit"} &rarr;
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"secondary"}>My reported People</Button>
            </DialogTrigger>
            <DialogContent className="max-h-screen overflow-auto">
              <DialogHeader>
                <DialogTitle>Lost People Linked with your account</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  People who are lost and linked with your account, mark found
                  if they are no longer lost.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                {lostPeople.map((person) => (
                  <div key={person.id} className="flex items-center gap-4">
                    <img
                      src={person.picture || "https://via.placeholder.com/80"}
                      alt="Person"
                      className="w-20 h-20 rounded-full"
                    />
                    <div className="flex flex-col gap-2">
                      <h4 className="text-lg font-semibold capitalize">
                        {person.name}
                      </h4>
                      <p className="text-muted-foreground">Age: {person.age}</p>
                      <div className="flex gap-2 items-center flex-wrap">
                        <Button variant="secondary" asChild>
                          <Link
                            href={`https://www.google.com/maps?q=${person?.lat},${person?.long}`}
                            className="text-muted-foreground"
                          >
                            View on Map
                          </Link>
                        </Button>
                        <Button
                          onClick={() => handleMarkAsFound(person.id)}
                          disabled={isConfirming}
                        >
                          {isConfirming ? "Confirming..." : "Mark as Found"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Separator className="my-4" />
      {/* Search input */}
      <div className="mb-4">
        <Input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search lost people..."
        />
      </div>
      {/* Render all lost people */}
      <div className="flex flex-wrap justify-around items-center mb-10">
        {lostPeople.map((person) => (
          <Card key={person.id} className="max-w-[300px] w-full bg-card">
            <CardHeader>
              <div>
                <Badge variant={person.found ? "default" : "outline"}>
                  {person.found ? "Found" : "Lost"}
                </Badge>
              </div>
              <img
                src={person.picture || "/placeholder-user.jpg"}
                alt="User Avatar"
                className="rounded-lg mt-4 w-full"
              />
            </CardHeader>
            <CardContent>
              <h3 className="text-2xl font-medium">{person.name}</h3>
              <p className="text-muted-foreground">Age: {person.age}</p>
              <Separator className="my-4" />
              <div className="flex justify-between items-center flex-wrap gap-2 w-full mt-2">
                <Button variant="default" className="w-full">
                  <Link
                    href={`https://www.google.com/maps?q=${person.lat},${person.long}`}
                  >
                    View on Map
                  </Link>
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary">View Details</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <h4 className="text-lg font-semibold">Message:</h4>
                    <p>{person.message}</p>
                  </DialogContent>
                </Dialog>
                <Button variant="outline">
                  <Link href={`mailto:${person.user_email}`}>Mail me</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default FindPeople;
