"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { toast } from "sonner";
import { CameraIcon, LocateIcon, Loader2 } from "lucide-react";

export default function AddInfoFormV0({
  addUserIncident,
}: {
  addUserIncident: (
    name: string,
    email: string,
    lat: number,
    long: number,
    photoUrl: string
  ) => Promise<void>;
}) {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [location, setLocation] = useState<{
    lat: number;
    long: number;
  } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [uploadingPhoto, setUploadingPhoto] = useState<boolean>(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createSupabaseBrowser();
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
        setName(user?.user_metadata?.full_name || "");
        setEmail(user?.email || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch user data");
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    setIsFormValid(!!name && !!email && !!photoUrl && location !== null);
  }, [name, email, photoUrl, location]);

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
        const supabase = createSupabaseBrowser();

        // Generate a unique filename with timestamp
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

    setIsSubmitting(true);
    try {
      await addUserIncident(
        name,
        email,
        location!.lat,
        location!.long,
        photoUrl!
      );
      toast.success("Information updated successfully");
      setPhotoUrl(null);
      setPhoto(null);
      setLocation(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to update information");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto max-w-md p-6 sm:p-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Update Your Neighbouring
        </CardTitle>
        <CardDescription>
          Provide your latest information to keep others up-to-date.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              disabled={true}
              onChange={(e) => setEmail(e.target.value)}
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
                disabled={isSubmitting || uploadingPhoto}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("photo")?.click()}
                disabled={isSubmitting || uploadingPhoto}
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
              disabled={isSubmitting || loadingLocation}
            >
              {loadingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <LocateIcon className="h-4 w-4 mr-2" />
              )}
              {loadingLocation ? "Fetching location..." : "Get my location"}
            </Button>
            {location && (
              <p className="text-sm text-green-600">
                Location: {location.lat.toFixed(6)}, {location.long.toFixed(6)}
              </p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          {isSubmitting ? "Updating..." : "Update Information"}
        </Button>
      </CardFooter>
    </Card>
  );
}
