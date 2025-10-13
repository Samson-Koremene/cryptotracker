import { useState, useEffect } from "react";

export interface Transaction {
  id: string;
  cryptoId: string;
  cryptoName: string;
  symbol: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  date: string;
  notes?: string;
}

const TRANSACTIONS_KEY = "crypto-transactions";

export const useTransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const stored = localStorage.getItem(TRANSACTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const removeTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  return { transactions, addTransaction, removeTransaction, updateTransaction };
};
