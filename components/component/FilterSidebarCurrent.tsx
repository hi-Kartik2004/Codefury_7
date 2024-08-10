"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function FilterSidebarCurrent() {
  return (
    <form
      action="/map-dashboard"
      method="GET"
      className="flex flex-col gap-4 bg-background p-6 sm:p-8"
    >
      <div className="grid gap-2">
        <Label htmlFor="query">Search</Label>
        <Input id="query" name="query" placeholder="Enter a search query" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Select name="category">
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Points</SelectItem>
            <SelectItem value="news-points">News Points</SelectItem>
            <SelectItem value="user-points">User reported points</SelectItem>
            <SelectItem value="lost-people">Lost People</SelectItem>
            <SelectItem value="found-people">Found People</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">
        Apply Filters
      </Button>
    </form>
  );
}
