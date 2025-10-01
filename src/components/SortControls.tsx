import { Button } from "@/components/ui/button";
import { ArrowUpDown, TrendingUp, DollarSign, Activity } from "lucide-react";

export type SortOption = "market_cap" | "current_price" | "price_change_percentage_24h" | "total_volume";

interface SortControlsProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SortControls = ({ currentSort, onSortChange }: SortControlsProps) => {
  const sortOptions = [
    { value: "market_cap" as SortOption, label: "Market Cap", icon: TrendingUp },
    { value: "current_price" as SortOption, label: "Price", icon: DollarSign },
    { value: "price_change_percentage_24h" as SortOption, label: "24h Change", icon: Activity },
    { value: "total_volume" as SortOption, label: "Volume", icon: ArrowUpDown },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {sortOptions.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          variant={currentSort === value ? "default" : "outline"}
          size="sm"
          onClick={() => onSortChange(value)}
          className="gap-2"
        >
          <Icon size={16} />
          {label}
        </Button>
      ))}
    </div>
  );
};
