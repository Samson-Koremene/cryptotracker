import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CryptoData } from "@/hooks/useCryptoData";
import { useToast } from "@/hooks/use-toast";

interface ExportButtonProps {
  data: CryptoData[];
}

export const ExportButton = ({ data }: ExportButtonProps) => {
  const { toast } = useToast();

  const exportToCSV = () => {
    if (!data || data.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no cryptocurrencies to export.",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Name", "Symbol", "Price", "24h Change %", "Market Cap", "Volume"];
    const csvContent = [
      headers.join(","),
      ...data.map(crypto => [
        crypto.name,
        crypto.symbol.toUpperCase(),
        crypto.current_price,
        crypto.price_change_percentage_24h.toFixed(2),
        crypto.market_cap,
        crypto.total_volume
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `crypto-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "Cryptocurrency data has been exported to CSV.",
    });
  };

  return (
    <Button
      variant="outline"
      onClick={exportToCSV}
      className="gap-2"
    >
      <Download size={16} />
      Export CSV
    </Button>
  );
};
