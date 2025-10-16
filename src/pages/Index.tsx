import { useState, useEffect } from "react";
import { CryptoCard } from "@/components/CryptoCard";
import { CryptoSkeleton } from "@/components/CryptoSkeleton";
import { SearchBar } from "@/components/SearchBar";
import { SortControls, SortOption } from "@/components/SortControls";
import { CryptoDetailModal } from "@/components/CryptoDetailModal";
import { NewsSection } from "@/components/NewsSection";
import { MarketOverview } from "@/components/MarketOverview";
import { TopMovers } from "@/components/TopMovers";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TableView } from "@/components/TableView";
import { ExportButton } from "@/components/ExportButton";
import { PortfolioModal } from "@/components/PortfolioModal";
import { FearGreedIndex } from "@/components/FearGreedIndex";
import { PriceAlertsModal } from "@/components/PriceAlertsModal";
import { TransactionHistory } from "@/components/TransactionHistory";
import { PriceComparison } from "@/components/PriceComparison";
import { CalculatorSidebar } from "@/components/CalculatorSidebar";
import { useCryptoData, CryptoData } from "@/hooks/useCryptoData";
import { useFavorites } from "@/hooks/useFavorites";
import { usePriceAlerts } from "@/hooks/usePriceAlerts";
import { TrendingUp, Star, LayoutGrid, List, Wallet, Bell, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("market_cap");
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(12);
  const { data: cryptoData, isLoading, error } = useCryptoData();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { alerts, triggerAlert } = usePriceAlerts();
  const { toast } = useToast();

  // Check price alerts
  useEffect(() => {
    if (!cryptoData || alerts.length === 0) return;

    alerts.forEach((alert) => {
      const crypto = cryptoData.find((c) => c.id === alert.cryptoId);
      if (!crypto || alert.triggered) return;

      const shouldTrigger =
        (alert.condition === "above" && crypto.current_price > alert.targetPrice) ||
        (alert.condition === "below" && crypto.current_price < alert.targetPrice);

      if (shouldTrigger) {
        triggerAlert(alert.id);
        toast({
          title: "Price Alert Triggered! 🔔",
          description: `${crypto.name} is now ${alert.condition} $${alert.targetPrice}`,
        });
      }
    });
  }, [cryptoData, alerts, triggerAlert, toast]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching data",
        description: "Failed to load cryptocurrency data. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

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

  const displayedData = filteredAndSortedData?.slice(0, displayLimit);

  return (
    <div className="min-h-screen bg-background w-full flex">
      <div className="flex-1 min-w-0">
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
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={showOnlyFavorites ? "default" : "outline"}
                      onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                      className="gap-2 whitespace-nowrap"
                    >
                      <Star size={16} className={showOnlyFavorites ? "fill-current" : ""} />
                      Favorites {favorites.length > 0 && `(${favorites.length})`}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowPortfolio(true)}
                      className="gap-2 whitespace-nowrap"
                    >
                      <Wallet size={16} />
                      Portfolio
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAlerts(true)}
                      className="gap-2 whitespace-nowrap"
                    >
                      <Bell size={16} />
                      Alerts {alerts.length > 0 && `(${alerts.length})`}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowTransactions(true)}
                      className="gap-2 whitespace-nowrap"
                    >
                      <History size={16} />
                      History
                    </Button>
                    <SidebarTrigger className="gap-2" />
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">
            {/* Market Overview & Fear & Greed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <MarketOverview />
              </div>
              <FearGreedIndex />
            </div>

            {/* Price Comparison */}
            <div className="mb-8">
              {cryptoData && <PriceComparison cryptoData={cryptoData} />}
            </div>

            {/* Top Movers */}
            {cryptoData && cryptoData.length > 0 && (
              <TopMovers cryptoData={cryptoData} onCryptoClick={setSelectedCrypto} />
            )}

            {/* News Section */}
            <NewsSection />
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
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={showOnlyFavorites ? "default" : "outline"}
                  onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                  className="gap-2 whitespace-nowrap"
                >
                  <Star size={16} className={showOnlyFavorites ? "fill-current" : ""} />
                  Favorites {favorites.length > 0 && `(${favorites.length})`}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPortfolio(true)}
                  className="gap-2 whitespace-nowrap"
                >
                  <Wallet size={16} />
                  Portfolio
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAlerts(true)}
                  className="gap-2 whitespace-nowrap"
                >
                  <Bell size={16} />
                  Alerts {alerts.length > 0 && `(${alerts.length})`}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowTransactions(true)}
                  className="gap-2 whitespace-nowrap"
                >
                  <History size={16} />
                  History
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

        {cryptoData && cryptoData.length > 0 && (
          <TopMovers cryptoData={cryptoData} onCryptoClick={setSelectedCrypto} />
        )}

        {/* News Section */}
        <NewsSection />

        {/* Sort Controls */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">Sort by:</h2>
            <SortControls currentSort={sortBy} onSortChange={setSortBy} />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid size={18} />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("table")}
            >
              <List size={18} />
            </Button>
            {filteredAndSortedData && <ExportButton data={filteredAndSortedData} />}
          </div>
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
                    Showing {displayedData?.length} of {filteredAndSortedData.length} {filteredAndSortedData.length === 1 ? "cryptocurrency" : "cryptocurrencies"}
                    {showOnlyFavorites && " in favorites"}
                  </p>
                </div>
                
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedData?.map((crypto) => (
                      <CryptoCard
                        key={crypto.id}
                        {...crypto}
                        isFavorite={isFavorite(crypto.id)}
                        onToggleFavorite={toggleFavorite}
                        onClick={() => setSelectedCrypto(crypto)}
                      />
                    ))}
                  </div>
                ) : (
                  displayedData && (
                    <TableView
                      data={displayedData}
                      onCryptoClick={setSelectedCrypto}
                      isFavorite={isFavorite}
                      onToggleFavorite={toggleFavorite}
                    />
                  )
                )}

                {displayedData && displayedData.length < filteredAndSortedData.length && (
                  <div className="text-center mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setDisplayLimit(prev => prev + 12)}
                      className="gap-2"
                    >
                      Load More
                    </Button>
                  </div>
                )}
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

        <PortfolioModal
          isOpen={showPortfolio}
          onClose={() => setShowPortfolio(false)}
          cryptoData={cryptoData || []}
        />

        <PriceAlertsModal
          isOpen={showAlerts}
          onClose={() => setShowAlerts(false)}
          cryptoData={cryptoData || []}
        />

        <TransactionHistory
          isOpen={showTransactions}
          onClose={() => setShowTransactions(false)}
          cryptoData={cryptoData || []}
        />
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 mt-12">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>Data provided by CoinGecko • Updates every 30 seconds</p>
          </div>
        </footer>
      </div>

      <CalculatorSidebar />
    </div>
  );
};

export default Index;
