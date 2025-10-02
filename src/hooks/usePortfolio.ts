import { useState, useEffect } from "react";

export interface PortfolioItem {
  id: string;
  amount: number;
  buyPrice: number;
}

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("crypto-portfolio");
    if (stored) {
      setPortfolio(JSON.parse(stored));
    }
  }, []);

  const savePortfolio = (newPortfolio: PortfolioItem[]) => {
    setPortfolio(newPortfolio);
    localStorage.setItem("crypto-portfolio", JSON.stringify(newPortfolio));
  };

  const addToPortfolio = (id: string, amount: number, buyPrice: number) => {
    const existing = portfolio.find(item => item.id === id);
    if (existing) {
      const updated = portfolio.map(item =>
        item.id === id
          ? { ...item, amount: item.amount + amount }
          : item
      );
      savePortfolio(updated);
    } else {
      savePortfolio([...portfolio, { id, amount, buyPrice }]);
    }
  };

  const removeFromPortfolio = (id: string) => {
    savePortfolio(portfolio.filter(item => item.id !== id));
  };

  const updatePortfolioItem = (id: string, amount: number, buyPrice: number) => {
    savePortfolio(
      portfolio.map(item =>
        item.id === id ? { id, amount, buyPrice } : item
      )
    );
  };

  const isInPortfolio = (id: string) => {
    return portfolio.some(item => item.id === id);
  };

  return {
    portfolio,
    addToPortfolio,
    removeFromPortfolio,
    updatePortfolioItem,
    isInPortfolio,
  };
};
