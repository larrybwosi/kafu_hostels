import { createClient } from "@sanity/client";

export const projectId = process.env.EXPO_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.EXPO_PUBLIC_SANITY_DATASET || "production";

export const apiVersion = "1";

// Create a client with credentials
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // For real-time data
  token: process.env.SANITY_API_TOKEN, // Only needed for write operations
});
