import { db } from "@/lib/db";

// Verifica se um email específico é de admin
export function isAdminEmail(email: string): boolean {
  return false;
}

// Get current user
export function getCurrentUser() {
  return null;
}

export async function getUserProfile(userId: string) {
  try {
    return await db.getDoc("users", userId);
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}