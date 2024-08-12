import { createSupabaseServer } from "@/lib/supabase/server";
import cron from "node-cron";

interface Article {
  title: string;
  url: string;
  location: Location;
  eventUri: string;
  dateTime: string;
}

interface Location {
  long: number;
  lat: number;
  population: number;
}

interface NewsData {
  articles: {
    results: Article[];
    totalResults: number;
  };
}

async function fetchAndStoreNewsData() {
  const supabase = createSupabaseServer();
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  if (!apiKey) {
    console.error("News API key not found on /populate-news-data-on-map");
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
      ],
    },
  };

  const params = new URLSearchParams({
    query: JSON.stringify(queryObject),
    resultType: "articles",
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

    for (const article of result.articles.results) {
      const { eventUri, url: readUrl, dateTime, location } = article;
      const { lat, long, population } = location;

      if (
        lat != 22 &&
        long != 79 &&
        eventUri &&
        readUrl &&
        dateTime &&
        population
      ) {
        // Check if the URL already exists in the database
        const { data: existingData, error: fetchError } = await supabase
          .from("newsIncidentLocations")
          .select("id")
          .eq("read_url", readUrl)
          .limit(1)
          .single();

        if (fetchError) {
          console.error(
            "Error fetching data from Supabase:",
            fetchError.message
          );
          continue;
        }

        if (!existingData) {
          const { error: insertError } = await supabase
            .from("newsIncidentLocations")
            .insert([
              {
                lat,
                long,
                read_url: readUrl,
                updated_at: dateTime,
                population,
              },
            ]);

          console.log("Inserted new data");

          if (insertError) {
            console.error(
              "Error inserting data into Supabase:",
              insertError.message
            );
          }
        } else {
          console.log(
            "Data already exists in the database, skipping insertion"
          );
        }
      }
    }
  } catch (error) {
    console.error("Error fetching news data:", (error as Error).message);
  }
}

// Schedule the task to run every second
cron.schedule("* * * * * *", fetchAndStoreNewsData);

console.log("Cron job is running to fetch and store news data every second.");
