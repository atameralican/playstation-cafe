// hooks/useServiceHook.tsx
"use client";

import { useState, useCallback } from "react";

interface ServiseGitOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: Record<string, unknown>;
  headers?: HeadersInit;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
  showLoading?: boolean;
  loadingText?: string;
}

interface LoadingState {
  id: string;
  text: string;
}

// Global loading state yönetimi için
const loadingStates = new Set<LoadingState>();
const loadingListeners = new Set<() => void>();
let loadingIdCounter = 0;

export const useServiceHook = () => {
  const [localLoading, setLocalLoading] = useState(false);

  const addLoading = (text: string) => {
    const id = `loading-${Date.now()}-${++loadingIdCounter}`;
    const loadingState = { id, text };
    loadingStates.add(loadingState);
    loadingListeners.forEach((listener) => listener());
    return id;
  };

  const removeLoading = (id: string) => {
    const stateToRemove = Array.from(loadingStates).find((s) => s.id === id);
    if (stateToRemove) {
      loadingStates.delete(stateToRemove);
      loadingListeners.forEach((listener) => listener());
    }
  };

  const serviseGit = useCallback(
    async <T = unknown,>(options: ServiseGitOptions): Promise<T | null> => {
      const {
        url,
        method = "GET",
        body,
        headers = {},
        onSuccess,
        onError,
        showLoading = true,
        loadingText = "İşlem yapılıyor...",
      } = options;

      const loadingId = showLoading ? addLoading(loadingText) : null;
      setLocalLoading(true);

      try {
        const fetchOptions: RequestInit = {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
        };

        if (body && method !== "GET") {
          fetchOptions.body = JSON.stringify(body);
        }

        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json() as T;

        if (onSuccess) {
          onSuccess(data);
        }

        return data;
      } catch (error) {
        console.error("Servis hatası:", error);

        const errorObj = error instanceof Error 
          ? error 
          : new Error(String(error));

        if (onError) {
          onError(errorObj);
        }

        throw errorObj;
      } finally {
        if (loadingId) {
          removeLoading(loadingId);
        }
        setLocalLoading(false);
      }
    },
    []
  );

  return {
    serviseGit,
    loading: localLoading,
  };
};

// Global loading state'i dinlemek için hook
export const useGlobalLoading = () => {
  const [loadings, setLoadings] = useState<LoadingState[]>([]);

  useState(() => {
    const updateLoadings = () => {
      setLoadings(Array.from(loadingStates));
    };

    loadingListeners.add(updateLoadings);
    return () => {
      loadingListeners.delete(updateLoadings);
    };
  });

  return {
    loadings,
    isLoading: loadings.length > 0,
  };
};