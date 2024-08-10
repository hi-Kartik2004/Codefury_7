import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsTrigger } from "../ui/tabs";
import { TabsList } from "@radix-ui/react-tabs";

export function MapDashboard() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 bg-muted">
        <div className="h-full w-full" />
      </div>
      <Tabs
        defaultValue="current"
        className="max-w-[400px] w-full p-2 rounded-sm"
      >
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
            <h1>Current</h1>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter a location" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date-range">Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-range"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
                      Pick a date range
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar initialFocus mode="range" numberOfMonths={1} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurants">Restaurants</SelectItem>
                    <SelectItem value="attractions">Attractions</SelectItem>
                    <SelectItem value="hotels">Hotels</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Apply Filters</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="future">
          <div className="flex flex-col gap-4 bg-background p-6 sm:p-8">
            <h1>Future</h1>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter a location" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date-range">Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-range"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
                      Pick a date range
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar initialFocus mode="range" numberOfMonths={1} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurants">Restaurants</SelectItem>
                    <SelectItem value="attractions">Attractions</SelectItem>
                    <SelectItem value="hotels">Hotels</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Apply Filters</Button>
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
