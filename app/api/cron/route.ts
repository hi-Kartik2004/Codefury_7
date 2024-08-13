import supabaseAdmin from "@/lib/supabase/admin";

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

const MAX_PAGES_PER_RUN = 17; // Adjust this based on your needs and Vercel's limits
const ARTICLES_PER_PAGE = 100;
export const dynamic = "force-dynamic"; // Force dynamic (server) route instead of static page

export async function GET(req: Request) {
  const supabase = supabaseAdmin();
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  if (!apiKey) {
    console.error("News API key not found on /fetch-news-data");
    return Response.json(
      { success: false, message: "API key missing" },
      { status: 500 }
    );
  }

  const baseUrl = "https://newsapi.ai/api/v1/article/getArticles";

  try {
    let pagesProcessed = 0;
    let totalInserted = 0;

    while (pagesProcessed < MAX_PAGES_PER_RUN) {
      const requestBody = {
        query: {
          $query: {
            $or: [
              {
                categoryUri:
                  "dmoz/Science/Earth_Sciences/Natural_Disasters_and_Hazards",
              },
              {
                categoryUri:
                  "dmoz/Society/Philanthropy/Disaster_Relief_and_Recovery",
              },
            ],
          },
          $filter: {
            forceMaxDataTimeWindow: "7",
          },
        },
        resultType: "articles",
        articlesSortBy: "date",
        apiKey: apiKey,
        includeArticleLocation: true,
        includeLocationGeoLocation: true,
        includeLocationPopulation: true,
        includeLocationGeoNamesId: true,
        articlesPage: pagesProcessed + 1,
        articlesCount: ARTICLES_PER_PAGE,
      };

      const response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (
        !result.articles ||
        !result.articles.results ||
        result.articles.results.length === 0
      ) {
        console.log("No more articles found");
        break;
      }

      const insertedCount = await processArticles(
        result.articles.results,
        supabase
      );
      totalInserted += insertedCount;

      pagesProcessed++;
    }

    console.log(
      `Processed ${pagesProcessed} pages, inserted ${totalInserted} new records`
    );
    return Response.json({
      success: true,
      message: `Processed ${pagesProcessed} pages, inserted ${totalInserted} new records`,
    });
  } catch (error) {
    console.error("Error fetching news data:", (error as Error).message);
    return Response.json(
      { success: false, message: "Error fetching news data" },
      { status: 500 }
    );
  }
}

async function processArticles(
  articles: Article[],
  supabase: any
): Promise<number> {
  let insertedCount = 0;

  for (const article of articles) {
    if (article.location) {
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
        const { data: existingData, error: fetchError } = await supabase
          .from("newsIncidentLocations")
          .select("id")
          .eq("read_url", readUrl);

        if (fetchError) {
          console.error(
            "Error fetching data from Supabase:",
            fetchError.message
          );
          continue;
        }

        if (!existingData || existingData.length === 0) {
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

          if (insertError) {
            console.error(
              "Error inserting data into Supabase:",
              insertError.message
            );
          } else {
            insertedCount++;
          }
        }
      }
    }
  }

  return insertedCount;
}
