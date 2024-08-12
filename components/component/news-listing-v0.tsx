import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export function NewsListingV0({ articles }: any) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-wrap items-center gap-4 justify-around">
          {articles.map((article: any, index: number) => (
            <Card key={index} className="max-w-[400px] overflow-hidden">
              <Link href={article?.url} className="block" prefetch={false}>
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  width={400}
                  height={225}
                  className="rounded-t-md object-cover w-full h-48"
                  style={{ aspectRatio: "400/225", objectFit: "cover" }}
                />
              </Link>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2 gap-4">
                  <span className="text-sm text-muted-foreground">
                    {new Date(article.dateTime).toLocaleDateString()}
                  </span>
                  <Badge variant="secondary">
                    {article.source?.title || "News"}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  <Link
                    href={article.url}
                    className="hover:underline"
                    prefetch={false}
                  >
                    {article.title}
                  </Link>
                </h3>
                <p className="text-muted-foreground line-clamp-5 text-ellipsis">
                  {article.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
