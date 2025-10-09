
import { db } from "@/lib/db";

export async function getCart(userId: string) {
  try {
    return await db.getDoc("carts", userId);
  } catch (error) {
    console.error("Error getting cart:", error);
    return null;
  }
}

export async function setCart(userId: string, cart: any) {
  try {
    await db.set("carts", userId, cart);
  } catch (error) {
    console.error("Error setting cart:", error);
  }
}
