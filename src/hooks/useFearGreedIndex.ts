import { useQuery } from "@tanstack/react-query";

export interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update?: string;
}

const fetchFearGreedIndex = async (): Promise<FearGreedData> => {
  const response = await fetch("https://api.alternative.me/fng/?limit=1");
  
  if (!response.ok) {
    throw new Error("Failed to fetch Fear & Greed Index");
  }
  
  const data = await response.json();
  return data.data[0];
};

export const useFearGreedIndex = () => {
  return useQuery({
    queryKey: ["fear-greed-index"],
    queryFn: fetchFearGreedIndex,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};
