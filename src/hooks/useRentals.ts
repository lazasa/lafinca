'use client'

import { useAuth } from "@/contexts/AuthContext";
import { Rental } from "@/types/rental";
import { useCallback, useState } from "react";
import { useEffect } from "react";

export function useRentals() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loadingRentals, setLoadingRentals] = useState(true);

  const { accessToken } = useAuth();

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

      const response = await fetch(
        `/api/rentals?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
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
  }, [accessToken, currentDate]);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  return { rentals, loadingRentals, currentDate, setCurrentDate, updateRentals: setRentals };
}