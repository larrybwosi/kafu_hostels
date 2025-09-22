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
    "skZqBaDo26LDEBL3sIxHDFq9dZrp90ZPsrYbnED563vr9HfmrjdY19vIIn1seKAlfKjnXTP4X3TlIcesMRVYL8QT2TcbTOm0OsKjOXBb4ErpdgCTYJBODB3eRkvl4oEADOQ4WcnDbX9JN9vmNrIF01d3kSXZKTDwywfd8KoCoX4l2gBOdNwC", // Only if you want to update content with the client
});
