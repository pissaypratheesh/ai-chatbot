"use client";

import { useCallback, useRef } from "react";

interface CancellableRequestOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
}

/**
 * Custom hook for handling cancellable API requests
 * Prevents race conditions by canceling previous requests
 */
export function useCancellableRequest() {
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef<number>(0);

  const makeRequest = useCallback(async (
    url: string,
    options: RequestInit = {},
    requestOptions: CancellableRequestOptions = {}
  ) => {
    const { onSuccess, onError, onCancel } = requestOptions;

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Generate unique request ID
    const requestId = ++requestIdRef.current;

    try {
      const response = await fetch(url, {
        ...options,
        signal: abortController.signal,
      });

      // Check if this request was cancelled
      if (abortController.signal.aborted) {
        console.log(`Request ${requestId} was cancelled`);
        onCancel?.();
        return;
      }

      // Check if this is still the latest request
      if (requestId !== requestIdRef.current) {
        console.log(`Request ${requestId} is stale, ignoring response`);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Request ${requestId} completed successfully`);
      onSuccess?.(data);
      return data;
    } catch (error) {
      // Check if this request was cancelled
      if (abortController.signal.aborted) {
        console.log(`Request ${requestId} was cancelled`);
        onCancel?.();
        return;
      }

      // Check if this is still the latest request
      if (requestId !== requestIdRef.current) {
        console.log(`Request ${requestId} is stale, ignoring error`);
        return;
      }

      console.error(`Request ${requestId} failed:`, error);
      onError?.(error as Error);
      throw error;
    }
  }, []);

  const cancelCurrentRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    makeRequest,
    cancelCurrentRequest,
  };
}
