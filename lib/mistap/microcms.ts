import { createClient } from "microcms-js-sdk";

// Client SDKの初期化
const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

if (!serviceDomain || !apiKey) {
  throw new Error(
    "MICROCMS_SERVICE_DOMAIN and MICROCMS_API_KEY must be set in environment variables"
  );
}

export const client = createClient({
  serviceDomain,
  apiKey,
});