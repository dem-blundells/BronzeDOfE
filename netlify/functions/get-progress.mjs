import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const store = getStore({ name: "dofe-progress", consistency: "strong" });
  const data = await store.get("teams", { type: "json" });
  return Response.json(data || { teams: {}, lastUpdated: null });
};

export const config = { path: "/api/get-progress" };
