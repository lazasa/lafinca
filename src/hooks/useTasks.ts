'use client'

import { useAuth } from "@/contexts/AuthContext";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { Task } from "@/types/task";
import { TaskStatus } from "@prisma/client";
import { useCallback, useState, useEffect } from "react";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const { accessToken } = useAuth();
  const authenticatedFetch = useAuthenticatedFetch();

  const fetchTasks = useCallback(async (status?: TaskStatus) => {
    if (!accessToken) return;

    setLoadingTasks(true);
    try {
      const url = status ? `/api/tasks?status=${status}` : "/api/tasks";
      const response = await authenticatedFetch(url);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTasks(data.tasks || []);
        }
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoadingTasks(false);
    }
  }, [accessToken, authenticatedFetch]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loadingTasks, fetchTasks, setTasks };
}
