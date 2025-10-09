
import { db } from "@/lib/db";

export const getDb = () => db;

export const createDocument = async (collectionName: string, data: Record<string, unknown>): Promise<string> => {
  return await db.add(collectionName, data);
}

export const updateDocument = async (collectionName: string, docId: string, data: Record<string, unknown>): Promise<void> => {
  await db.update(collectionName, docId, data);
}

export const getDocument = async (collectionName: string, docId: string) => {
  return await db.getDoc(collectionName, docId);
}

export const listDocuments = async (collectionName: string, options?: any) => {
  return await db.list(collectionName, options);
}

export const deleteDocument = async (collectionName: string, docId: string): Promise<void> => {
  await db.remove(collectionName, docId);
}

// Export for backward compatibility
export { db };
