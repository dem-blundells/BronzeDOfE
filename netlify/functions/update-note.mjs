import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await req.json();
  const { team, day, checkpoint, note } = body;

  if (!team || !day || checkpoint === undefined) {
    return new Response("Missing required fields", { status: 400 });
  }

  const store = getStore({ name: "dofe-progress", consistency: "strong" });
  const existing = (await store.get("teams", { type: "json" })) || { teams: {} };

  if (!existing.teams[team]) existing.teams[team] = { day1: {}, day2: {} };
  if (!existing.teams[team][day]) existing.teams[team][day] = {};
  if (!existing.teams[team][day][checkpoint]) {
    existing.teams[team][day][checkpoint] = { checked: false, timestamp: null, note: "" };
  }

  existing.teams[team][day][checkpoint].note = note;
  existing.lastUpdated = new Date().toISOString();

  await store.setJSON("teams", existing);
  return Response.json({ success: true });
};

export const config = { path: "/api/update-note" };
