import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await req.json();
  const { team, day, startTime, staffName } = body;

  if (!team || !day || !startTime) {
    return new Response("Missing required fields", { status: 400 });
  }

  const store = getStore({ name: "dofe-progress", consistency: "strong" });
  const existing = (await store.get("teams", { type: "json" })) || { teams: {} };

  if (!existing.teams[team]) existing.teams[team] = { day1: {}, day2: {} };
  existing.teams[team][`${day}_startTime`] = startTime;

  existing.lastUpdated = new Date().toISOString();
  existing.lastUpdatedBy = staffName || "Unknown";

  await store.setJSON("teams", existing);
  return Response.json({ success: true, data: existing });
};

export const config = { path: "/api/update-start-time" };
