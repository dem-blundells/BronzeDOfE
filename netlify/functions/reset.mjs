import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const store = getStore({ name: "dofe-progress", consistency: "strong" });
  await store.setJSON("teams", { teams: {}, lastUpdated: new Date().toISOString(), lastUpdatedBy: "Reset" });
  return Response.json({ success: true });
};

export const config = { path: "/api/reset" };
