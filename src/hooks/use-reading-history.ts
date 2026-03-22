"use client";

import { useState, useEffect, useCallback } from "react";

export interface ReadingHistoryItem {
  albumId: number;
  albumTitle: string;
  albumSlug: string;
  chapterId: number;
  chapterTitle: string;
  image_url: string;
  updatedAt: number;
}

const HISTORY_KEY = "qttruyen_reading_history";
const MAX_HISTORY = 20;

export function useReadingHistory() {
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse reading history", e);
      }
    }
  }, []);

  const addToHistory = useCallback((item: Omit<ReadingHistoryItem, "updatedAt">) => {
    const newItem: ReadingHistoryItem = {
      ...item,
      updatedAt: Date.now(),
    };

    setHistory((prev) => {
      const filtered = prev.filter((h) => h.albumId !== item.albumId);
      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  }, []);

  return { history, addToHistory, clearHistory };
}
