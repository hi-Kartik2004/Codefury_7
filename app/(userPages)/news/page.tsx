"use client";
import React, { useState } from "react";
import { NewsListingV0 } from "@/components/component/news-listing-v0";
import { Button } from "@/components/ui/button";
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
import { formatISO, subDays } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CaretSortIcon, ChevronDownIcon } from "@radix-ui/react-icons";

type Language =
  | "English"
  | "German"
  | "Hindi"
  | "Kannada"
  | "Tamil"
  | "Gujarati"
  | "Punjabi"
  | "Bengali"
  | "Urdu";
type SortByOption = "date" | "relevance" | "socialScore";

interface Article {
  title: string;
  url: string;
  // Add other fields as needed from the API response
}

interface NewsData {
  articles: {
    results: Article[];
    totalResults: number;
  };
}

const languageMapping: Record<Language, string> = {
  English: "eng",
  German: "deu",
  Hindi: "hin",
  Kannada: "kan",
  Tamil: "tam",
  Gujarati: "guj",
  Punjabi: "pan",
  Bengali: "ben",
  Urdu: "urd",
};

const News: React.FC = () => {
  const [keyword, setKeyword] = useState<string>("");
  const [location, setLocation] = useState<string>("India");
  const [language, setLanguage] = useState<Language>("English");
  const [sortBy, setSortBy] = useState<SortByOption>("socialScore");
  const [startDate, setStartDate] = useState<string>(
    formatISO(subDays(new Date(), 7), { representation: "date" })
  ); // Default to 7 days before today
  const [endDate, setEndDate] = useState<string>(
    formatISO(new Date(), { representation: "date" })
  ); // Default to today
  const [data, setData] = useState<NewsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalResults, setTotalResults] = useState<number>(0);

  const handleSearch = async (page: number = 1) => {
    setError(null);
    const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

    if (!apiKey) {
      setError("API key is missing. Please check your environment variables.");
      return;
    }

    const baseUrl = "https://www.newsapi.ai/api/v1/article/getArticles";

    const queryObject: any = {
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
          { lang: languageMapping[language] },
          {
            dateStart: formatISO(new Date(startDate), {
              representation: "date",
            }),
            dateEnd: formatISO(new Date(endDate), { representation: "date" }),
          },
        ],
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
      includeLocationGeoLocation: "true",
      includeLocationPopulation: "true",
      includeLocationGeoNamesId: "true",
      apiKey: apiKey,
      articlesPage: page.toString(),
      articlesCount: pageSize.toString(),
    });

    const url = `${baseUrl}?${params.toString()}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorText}`
        );
      }
      const result: NewsData = await response.json();
      setData(result);
      setTotalResults(result.articles.totalResults);
      setCurrentPage(page);
    } catch (error) {
      setError(`Error fetching news data: ${(error as Error).message}`);
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
            <Select
              value={language}
              onValueChange={(value) => setLanguage(value as Language)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(languageMapping).map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full md:w-auto"
            />
            <Input
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full md:w-auto mt-2 md:mt-0"
            />
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <CaretSortIcon className="w-5 h-5" />
                  <span>Sort by</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as SortByOption)}
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

      <div className="py-4">
        <div className="flex flex-wrap items-center gap-4"></div>
      </div>

      {data ? (
        <>
          <NewsListingV0 articles={data.articles.results} />
          <div className="flex justify-between mt-4">
            <Button
              disabled={currentPage <= 1}
              onClick={() => handleSearch(currentPage - 1)}
            >
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              disabled={currentPage >= totalPages}
              onClick={() => handleSearch(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center text-muted-foreground mt-4">
          No data to display.
        </div>
      )}
      <Separator className="my-6" />
    </div>
  );
};

export default News;
