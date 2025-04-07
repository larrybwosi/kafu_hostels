import { createClient } from "@sanity/client";

 const projectId = process.env.EXPO_PUBLIC_SANITY_PROJECT_ID;
 const dataset = process.env.EXPO_PUBLIC_SANITY_DATASET || "production";

export const apiVersion = "1";

// Create a client with credentials
export const client = createClient({
  projectId: "7rkl59hi",
  dataset: "production",
  apiVersion,
  useCdn: false, // For real-time data
  token:
    "sktcJVGLqDrWfdOGGIdbOtbQAQZZ5RSMrkofyDr1euIc0F9v4QM4B5PFTCPqCjMrhtcy8hp4p8nTAjRujpYij3UvtTSMvAsz6UmKEzGdfGIFuUAmjYZfn9pYTeeULPjohczwAOTVADF1I86ST0rO80nj8MI7s7yeV5p8To84G466GmzB8sky", // Only needed for write operations
});
