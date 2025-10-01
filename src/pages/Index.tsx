import { useState } from "react";
import { CryptoCard } from "@/components/CryptoCard";
import { CryptoSkeleton } from "@/components/CryptoSkeleton";
import { SearchBar } from "@/components/SearchBar";
import { SortControls, SortOption } from "@/components/SortControls";
import { CryptoDetailModal } from "@/components/CryptoDetailModal";
import { useCryptoData, CryptoData } from "@/hooks/useCryptoData";
import { useFavorites } from "@/hooks/useFavorites";
import { TrendingUp, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("market_cap");
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const { data: cryptoData, isLoading, error } = useCryptoData();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();

  if (error) {
    toast({
      title: "Error fetching data",
      description: "Failed to load cryptocurrency data. Please try again later.",
      variant: "destructive",
    });
  }

  const filteredAndSortedData = cryptoData
    ?.filter((crypto) => {
      const matchesSearch =
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFavorites = !showOnlyFavorites || isFavorite(crypto.id);
      return matchesSearch && matchesFavorites;
    })
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      return (bValue || 0) - (aValue || 0);
    });

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
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <Button
                variant={showOnlyFavorites ? "default" : "outline"}
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className="gap-2 whitespace-nowrap"
              >
                <Star size={16} className={showOnlyFavorites ? "fill-current" : ""} />
                Favorites {favorites.length > 0 && `(${favorites.length})`}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Sort Controls */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Sort by:</h2>
          <SortControls currentSort={sortBy} onSortChange={setSortBy} />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(12)].map((_, i) => (
              <CryptoSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {filteredAndSortedData && filteredAndSortedData.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    Showing {filteredAndSortedData.length} {filteredAndSortedData.length === 1 ? "cryptocurrency" : "cryptocurrencies"}
                    {showOnlyFavorites && " in favorites"}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedData.map((crypto) => (
                    <CryptoCard
                      key={crypto.id}
                      {...crypto}
                      isFavorite={isFavorite(crypto.id)}
                      onToggleFavorite={toggleFavorite}
                      onClick={() => setSelectedCrypto(crypto)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  {showOnlyFavorites
                    ? "No favorites yet. Click the star icon on any crypto to add it to your favorites!"
                    : `No cryptocurrencies found matching "${searchQuery}"`}
                </p>
              </div>
            )}
          </>
        )}

        <CryptoDetailModal
          crypto={selectedCrypto}
          isOpen={!!selectedCrypto}
          onClose={() => setSelectedCrypto(null)}
        />
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
