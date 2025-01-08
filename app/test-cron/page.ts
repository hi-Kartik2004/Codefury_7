"use client";
import supabaseAdmin from "@/lib/supabase/admin";
import React, { useEffect } from "react";

function page() {
  useEffect(() => {
    async function testCron() {
      const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

      if (!apiKey) {
        console.error("News API key not found on /fetch-news-data");
        return;
      }
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0];
      const baseUrl = "https://newsapi.ai/api/v1/article/getArticles";
      const MAX_PAGES_PER_RUN = 1;
      const ARTICLES_PER_PAGE = 100;
      try {
        let pagesProcessed = 0;
        let totalInserted: number | null = 0;
        console.log(formattedDate);

        while (pagesProcessed < MAX_PAGES_PER_RUN) {
          var requestBody = {
            query: {
              $query: {
                $and: [
                  {
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
                  {
                    dateStart: formattedDate,
                    dateEnd: formattedDate,
                  },
                ],
              },
              $filter: {
                forceMaxDataTimeWindow: "31",
              },
            },
            resultType: "articles",
            articlesSortBy: "date",
            includeArticleLocation: true,

            apiKey: apiKey,
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

          // const response = await fetch(fullUrl);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const result = await response.json();
          console.log(result);

          if (
            !result.articles ||
            !result.articles.results ||
            result.articles.results.length === 0
          ) {
            console.log("No more articles found");
            break;
          }

          const insertedCount = await processArticles(result.articles.results);
          totalInserted += insertedCount;

          pagesProcessed++;
        }

        console.log(
          `Processed ${pagesProcessed} pages, inserted ${totalInserted} new records`
        );
        console.log({
          success: true,
          message: `Processed ${pagesProcessed} pages, inserted ${totalInserted} new records`,
        });
        return;
      } catch (error) {
        console.error("Error fetching news data:", (error as Error).message);
        console.log(
          { success: false, message: "Error fetching news data" },
          { status: 500 }
        );
        return;
      }
    }

    function processArticles(articles: any[]) {
      let icount: number = 0;
      for (const article of articles) {
        if (article.location) {
          const { eventUri, url: readUrl, dateTime, location } = article;
          const { lat, long, population } = location;

          console.log(article);
          icount++;
        }
      }

      return icount;
    }

    testCron();
  }, []);
}

export default page;
