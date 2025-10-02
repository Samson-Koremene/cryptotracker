import { useQuery } from "@tanstack/react-query";

export interface NewsArticle {
  id: string;
  guid: string;
  published_on: number;
  imageurl: string;
  title: string;
  url: string;
  body: string;
  tags: string;
  categories: string;
  upvotes: string;
  downvotes: string;
  lang: string;
  source_info: {
    name: string;
    img: string;
  };
}

const fetchCryptoNews = async (): Promise<NewsArticle[]> => {
  const response = await fetch(
    "https://min-api.cryptocompare.com/data/v2/news/?lang=EN"
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch crypto news");
  }
  
  const data = await response.json();
  return data.Data || [];
};

export const useCryptoNews = () => {
  return useQuery({
    queryKey: ["crypto-news"],
    queryFn: fetchCryptoNews,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};
