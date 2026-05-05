"use client";

import { useEffect, useState } from "react";

export interface BookingConfig {
  application_id: string;
  location_id: string;
  environment: string;
}

let cached: BookingConfig | null = null;
let inflight: Promise<BookingConfig> | null = null;

async function loadConfig(): Promise<BookingConfig> {
  if (cached) return cached;
  if (inflight) return inflight;
  inflight = fetch("/api/booking/config")
    .then((r) => r.json())
    .then((data: BookingConfig) => {
      cached = data;
      return data;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function useBookingConfig(): BookingConfig | null {
  const [config, setConfig] = useState<BookingConfig | null>(cached);
  useEffect(() => {
    if (cached) {
      if (config !== cached) setConfig(cached);
      return;
    }
    let cancelled = false;
    loadConfig()
      .then((c) => {
        if (!cancelled) setConfig(c);
      })
      .catch(() => {
        // Surface failures via the page error UI; nothing to do here.
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return config;
}
