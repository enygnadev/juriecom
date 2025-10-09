import { db } from "@/lib/db";

export async function getSettings() {
  try {
    return await db.getDoc("settings", "general");
  } catch (error) {
    console.error("Error getting settings:", error);
    return null;
  }
}

export async function setSettings(settings: any) {
  try {
    await db.set("settings", "general", settings);
  } catch (error) {
    console.error("Error setting settings:", error);
  }
}