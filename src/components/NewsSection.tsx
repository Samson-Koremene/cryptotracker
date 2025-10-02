import { useCryptoNews } from "@/hooks/useCryptoNews";
import { NewsCard } from "@/components/NewsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Newspaper } from "lucide-react";

export const NewsSection = () => {
  const { data: newsArticles, isLoading } = useCryptoNews();

  const topNews = newsArticles?.slice(0, 6) || [];

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
          <Newspaper size={20} className="text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Trending Crypto News</h2>
          <p className="text-sm text-muted-foreground">Latest updates from the crypto world</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card p-4 rounded-lg border border-border/30">
              <div className="flex gap-4">
                <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topNews.map((article) => (
            <NewsCard key={article.guid} {...article} />
          ))}
        </div>
      )}
    </section>
  );
};
