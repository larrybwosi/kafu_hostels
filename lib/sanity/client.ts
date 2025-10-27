import { createClient } from "@sanity/client";

 const projectId = process.env.EXPO_PUBLIC_SANITY_PROJECT_ID;
 const dataset = process.env.EXPO_PUBLIC_SANITY_DATASET || "production";
 const token =
   "skLdiLQOqPGhGKRPEiohZ2Rl8zfIJ1fdMfHwuPGKEtZY5iWTEqbfrjg1I6L5kEXeauIqxYrnoQlEgcq0RGQ1AA0gT7tybrzrkXWtiOOkBc2hMmohApwMScxbUk8X5iaKzcAR7d1yKDVgHVPtOiL6Tqz0ngs50RRRzEvwBrR6bcFm4EVfOlWb";

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
