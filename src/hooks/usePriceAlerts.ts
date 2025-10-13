import { useState, useEffect } from "react";

export interface PriceAlert {
  id: string;
  cryptoId: string;
  cryptoName: string;
  targetPrice: number;
  condition: "above" | "below";
  triggered: boolean;
}

const ALERTS_KEY = "crypto-price-alerts";

export const usePriceAlerts = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    const stored = localStorage.getItem(ALERTS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  }, [alerts]);

  const addAlert = (alert: Omit<PriceAlert, "id" | "triggered">) => {
    const newAlert: PriceAlert = {
      ...alert,
      id: Date.now().toString(),
      triggered: false,
    };
    setAlerts((prev) => [...prev, newAlert]);
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const triggerAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, triggered: true } : alert
      )
    );
  };

  const resetAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, triggered: false } : alert
      )
    );
  };

  return { alerts, addAlert, removeAlert, triggerAlert, resetAlert };
};
