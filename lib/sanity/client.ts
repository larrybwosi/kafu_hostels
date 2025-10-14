import { createClient } from "@sanity/client";

 const projectId = process.env.EXPO_PUBLIC_SANITY_PROJECT_ID;
 const dataset = process.env.EXPO_PUBLIC_SANITY_DATASET || "production";
 const token = process.env.EXPO_PUBLIC_SANITY_TOKEN;

export const apiVersion = "2023-01-01";
console.log(projectId);
// Create a client with credentials
export const client = createClient({
  projectId: "7rkl59hi",
  dataset: "production",
  apiVersion,
  ignoreBrowserTokenWarning: true,
  useCdn:false,
  token
});
