import { ExternalLink, TrendingUp } from "lucide-react";
import { NewsArticle } from "@/hooks/useCryptoNews";

interface NewsCardProps extends NewsArticle {}

export const NewsCard = ({ 
  title, 
  body, 
  imageurl, 
  url, 
  source_info, 
  published_on 
}: NewsCardProps) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card p-4 rounded-lg border border-border/30 hover:border-primary/50 transition-all duration-300 group hover-scale block"
    >
      <div className="flex gap-4">
        {imageurl && (
          <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-muted">
            <img
              src={imageurl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <ExternalLink className="flex-shrink-0 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {body}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              {source_info?.img && (
                <img
                  src={source_info.img}
                  alt={source_info.name}
                  className="w-4 h-4 rounded-full"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <span>{source_info?.name}</span>
            </div>
            <span>{formatDate(published_on)}</span>
          </div>
        </div>
      </div>
    </a>
  );
};
