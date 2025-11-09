'use client'

import { useAuth } from "@/contexts/AuthContext";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { Rental } from "@/types/rental";
import { useCallback, useState } from "react";
import { useEffect } from "react";

export function useRentals() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loadingRentals, setLoadingRentals] = useState(true);

  const { accessToken } = useAuth();
  const authenticatedFetch = useAuthenticatedFetch();

  const fetchRentals = useCallback(async () => {
    if (!accessToken) return;

    setLoadingRentals(true);
    try {
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      const response = await authenticatedFetch(
        `/api/rentals?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRentals(data.rentals || []);
        }
      }
    } catch (error) {
      console.error("Error fetching rentals:", error);
    } finally {
      setLoadingRentals(false);
    }
  }, [accessToken, authenticatedFetch, currentDate]);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  return { rentals, loadingRentals, currentDate, setCurrentDate, updateRentals: setRentals, fetchRentals };
}