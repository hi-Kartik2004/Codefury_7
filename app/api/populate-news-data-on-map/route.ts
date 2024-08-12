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

export async function GET(req: Request) {
  const supabase = supabaseAdmin();
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  if (!apiKey) {
    console.error("News API key not found on /fetch-news-data");
    return;
  }

  const baseUrl = "https://newsapi.ai/api/v1/article/getArticles";

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
        forceMaxDataTimeWindow: "31",
      },
    },
    resultType: "articles",
    articlesSortBy: "date",
    apiKey: apiKey,
    includeArticleLocation: true,
    includeLocationGeoLocation: true,
    includeLocationPopulation: true,
    includeLocationGeoNamesId: true,
    articlesPage: 1, // Corrected property name
    articlesCount: 100,
  };

  try {
    let hasMoreArticles = true;

    while (hasMoreArticles) {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorText}`
        );
      }

      const result = await response.json();

      console.log(result.articles);

      if (result.articles.results && result.articles.results.length > 0) {
        console.log(`Fetched ${result.articles.length} articles`);
        let count = 0,
          total = 0;
        for (const article of result.articles.results) {
          console.log(article.location);
          total++;

          if (article.location) {
            count++;
            const { eventUri, url: readUrl, dateTime, location } = article;
            const { lat, long, population } = location;

            // console.log(article.results[0]);

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
        }

        console.log(`Inserted ${count}/${total} new records`);

        requestBody.articlesPage += 1;
      } else {
        hasMoreArticles = false;
        console.log("No more articles found");
      }
    }

    return Response.json({
      success: true,
      message: "News data fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching news data:", (error as Error).message);

    return Response.json({
      success: false,
      message: "Error fetching news data",
    });
  }
}
