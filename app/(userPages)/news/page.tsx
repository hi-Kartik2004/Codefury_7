"use client";
import React, { useState } from "react";
import { NewsListingV0 } from "@/components/component/news-listing-v0";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const News = () => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("India");
  const [language, setLanguage] = useState("eng");
  const [sortBy, setSortBy] = useState("socialScore");
  const [timeWindow, setTimeWindow] = useState("31");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);

  const handleSearch = async (page = 1) => {
    setError(null);
    const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
    console.log("API Key:", apiKey);

    if (!apiKey) {
      setError("API key is missing. Please check your environment variables.");
      return;
    }

    const baseUrl = "https://www.newsapi.ai/api/v1/article/getArticles";

    const queryObject = {
      $query: {
        $and: [
          {
            $or: [
              {
                categoryUri:
                  "dmoz/Society/Philanthropy/Disaster_Relief_and_Recovery",
              },
              {
                categoryUri:
                  "dmoz/Science/Earth_Sciences/Natural_Disasters_and_Hazards",
              },
            ],
          },
          {
            locationUri: `http://en.wikipedia.org/wiki/${encodeURIComponent(
              location
            )}`,
          },
          { lang: language },
        ],
      },
      $filter: {
        forceMaxDataTimeWindow: timeWindow,
      },
    };

    if (keyword) {
      queryObject.$query.$and.push({ keyword: keyword, keywordLoc: "title" });
    }

    const params = new URLSearchParams({
      query: JSON.stringify(queryObject),
      resultType: "articles",
      articlesSortBy: sortBy,
      includeArticleSocialScore: "true",
      includeArticleConcepts: "true",
      includeArticleCategories: "true",
      includeArticleLocation: "true",
      includeArticleImage: "true",
      includeArticleVideos: "true",
      includeArticleLinks: "true",
      includeArticleExtractedDates: "true",
      includeArticleOriginalArticle: "true",
      includeConceptImage: "true",
      includeConceptDescription: "true",
      includeConceptSynonyms: "true",
      includeConceptTrendingScore: "true",
      apiKey: apiKey,
      articlesPage: page,
      articlesCount: pageSize,
    });

    const url = `${baseUrl}?${params.toString()}`;
    console.log("Full URL:", url);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorText}`
        );
      }
      const result = await response.json();
      setData(result);
      setTotalResults(result.articles.totalResults);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching news data:", error);
      setError(`Error fetching news data: ${error.message}`);
    }
  };

  const totalPages = Math.ceil(totalResults / pageSize);

  return (
    <div className="pt-24 container">
      <div>
        <h1 className="text-5xl font-semibold bg-gradient-to-r max-w-[650px] from-yellow-500 to-orange-500 text-transparent bg-clip-text">
          Customizable News Search
        </h1>
        <p className="text-muted-foreground mt-2">
          Use the filters below to customize your news search.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="py-6 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <Input
              type="text"
              placeholder="Keyword (optional)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full md:w-auto"
            />
            <Input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full md:w-auto"
            />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eng">English</SelectItem>
                <SelectItem value="fra">French</SelectItem>
                <SelectItem value="deu">German</SelectItem>
                <SelectItem value="spa">Spanish</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeWindow} onValueChange={setTimeWindow}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Time Window" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="31">31 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <ListOrderedIcon className="w-5 h-5" />
                  <span>Sort by</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  <DropdownMenuRadioItem value="date">
                    Date
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="relevance">
                    Relevance
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="socialScore">
                    Social Score
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => handleSearch(1)}>Search</Button>
          </div>
        </div>
      </div>
      {data ? (
        <>
          <NewsListingV0 articles={data.articles.results} />
          <div className="my-8 flex justify-center">
            <div className="flex items-center justify-center gap-2 flex-wrap w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSearch(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon className="w-4 h-4" />
                <span className="sr-only">Previous</span>
              </Button>
              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="px-3"
                  onClick={() => handleSearch(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSearch(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRightIcon className="w-4 h-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center underline underline-offset-8 mt-10">
          Use the filters above to search for news articles.
        </p>
      )}
      <Separator className="mb-10" />
    </div>
  );
};

export default News;

// Icon components remain the same
function ChevronDownIcon(props) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronLeftIcon(props) {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function FilterIcon(props) {
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
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function ListOrderedIcon(props) {
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
      <line x1="10" x2="21" y1="6" y2="6" />
      <line x1="10" x2="21" y1="12" y2="12" />
      <line x1="10" x2="21" y1="18" y2="18" />
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  );
}

function MapPinIcon(props) {
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
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function MenuIcon(props) {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function NewspaperIcon(props) {
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
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6Z" />
    </svg>
  );
}

function SearchIcon(props) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
