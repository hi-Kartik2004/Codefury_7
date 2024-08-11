"use client";
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Badge } from "./ui/badge";

// Define the center coordinates type
type LatLngExpression = L.LatLngExpression;

const center: LatLngExpression = [22, 79];
const zoom: number = 5;

// Define the custom icons
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const newspaperIcon = new L.Icon({
  iconUrl:
    "https://png.pngtree.com/element_our/sm/20180516/sm_5afc4cd0dcaca.jpg",
  iconSize: [25, 25],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [21, 21],
});

const userIcon = new L.Icon({
  iconUrl:
    "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png",
  iconSize: [50, 30],
  iconAnchor: [30, 30],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [21, 21],
});

const lostIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/4501/4501552.png",
  iconSize: [40, 50],
  iconAnchor: [30, 30],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [21, 21],
});

const foundIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/5526/5526231.png",
  iconSize: [40, 40],
  iconAnchor: [30, 30],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [21, 21],
});

export function Map({
  newsReportedPoints = [],
  userReportedPoints = [],
  lostPeopleReportedPoints = [],
  foundPeopleReportedPoints = [],
  mylocation,
}: any): JSX.Element {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup chunkedLoading>
        {mylocation && (
          <Marker position={[mylocation.lat, mylocation.lng]} icon={customIcon}>
            <Popup>
              <div>
                <h1 className="text-2xl">You are here</h1>
                <p className="text-muted-foreground">Your current location</p>
              </div>
            </Popup>
          </Marker>
        )}
        {newsReportedPoints.length > 0 &&
          newsReportedPoints.map((point: any) => (
            <Marker
              key={point.id}
              position={[point.lat, point.long]}
              icon={newspaperIcon}
            >
              <Popup>
                <div>
                  <h1 className="text-2xl">
                    {point.population} people impacted
                  </h1>
                  <Link
                    href={point?.read_url}
                    target="_blank"
                    className="underline underline-offset-8"
                  >
                    Read more
                  </Link>
                  <p className="text-muted-foreground">{point?.created_at}</p>
                </div>
              </Popup>
            </Marker>
          ))}

        {userReportedPoints.length > 0 &&
          userReportedPoints.map((point: any) => (
            <Marker
              key={point.id}
              position={[point.lat, point.long]}
              icon={userIcon}
            >
              <Popup>
                <div className="flex gap-4 flex-wrap">
                  <div>
                    <h1 className="text-2xl">Reported By {point?.full_name}</h1>
                    <Link
                      href={`https://www.google.com/maps/dir/${point.lat},${point.long}`}
                      target="_blank"
                      className="underline underline-offset-8"
                    >
                      Route
                    </Link>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">View Details</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <div>
                        <h1 className="text-2xl">
                          Reported By {point?.full_name}
                        </h1>
                        <img
                          src={point?.picture_url}
                          alt="Picture of incident"
                          className="w-full max-w-[300px]"
                        />

                        <AlertDialogCancel asChild>
                          <Button variant="destructive">Close</Button>
                        </AlertDialogCancel>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                  <p className="text-muted-foreground">{point?.created_at}</p>
                </div>
              </Popup>
            </Marker>
          ))}

        {lostPeopleReportedPoints.length > 0 &&
          lostPeopleReportedPoints.map((point: any) => (
            <Marker
              key={point.id}
              position={[point.lat, point.long]}
              icon={lostIcon}
            >
              <Popup>
                <div className="flex gap-2 flex-wrap">
                  <div>
                    <Badge variant="destructive">Lost</Badge>
                    <h1 className="text-2xl">{point?.name}'s lost</h1>
                    <p>Age: {point?.age} years</p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-around items-center w-full">
                    <Link
                      href={`https://www.google.com/maps/dir/${point.lat},${point.long}`}
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
                            {point?.message}
                          </p>
                          <img
                            src={point?.picture}
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
                  <p className="text-muted-foreground">{point?.created_at}</p>
                </div>
              </Popup>
            </Marker>
          ))}

        {foundPeopleReportedPoints.length > 0 &&
          foundPeopleReportedPoints.map((point: any) => (
            <Marker
              key={point.id}
              position={[point.lat, point.long]}
              icon={foundIcon}
            >
              <Popup>
                <div className="flex gap-2 flex-wrap">
                  <div>
                    <Badge className="bg-green-500">Found!</Badge>
                    <h1 className="text-2xl">{point?.name}'s Found!</h1>
                    <p>Age: {point?.age} years</p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-around items-center w-full">
                    <Link
                      href={`https://www.google.com/maps/dir/${point.lat},${point.long}`}
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
                          <h1 className="text-2xl">Details:</h1>
                          <p className="text-muted-foreground mt-2">
                            {point?.details}
                          </p>
                          <img
                            src={point?.picture}
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
                  <p className="text-muted-foreground">{point?.created_at}</p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
