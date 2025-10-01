import { useState } from "react";
import { CryptoCard } from "@/components/CryptoCard";
import { CryptoSkeleton } from "@/components/CryptoSkeleton";
import { SearchBar } from "@/components/SearchBar";
import { useCryptoData } from "@/hooks/useCryptoData";
import { TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: cryptoData, isLoading, error } = useCryptoData();
  const { toast } = useToast();

  if (error) {
    toast({
      title: "Error fetching data",
      description: "Failed to load cryptocurrency data. Please try again later.",
      variant: "destructive",
    });
  }

  const filteredData = cryptoData?.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                <TrendingUp size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  CryptoTracker
                </h1>
                <p className="text-sm text-muted-foreground">Real-time cryptocurrency prices</p>
              </div>
            </div>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(12)].map((_, i) => (
              <CryptoSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {filteredData && filteredData.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    Showing {filteredData.length} {filteredData.length === 1 ? "cryptocurrency" : "cryptocurrencies"}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredData.map((crypto) => (
                    <CryptoCard key={crypto.id} {...crypto} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">No cryptocurrencies found matching "{searchQuery}"</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Data provided by CoinGecko • Updates every 30 seconds</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
