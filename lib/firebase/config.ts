// lib/firebase/config.ts - Mantido apenas para compatibilidade de imports
// Agora usa apenas PixelDB via API routes

export const app = null as any;
export const auth = null as any;
export const db = null as any;
export const storage = null as any;
export const analytics = null as any;

export function getAuth() {
  return auth;
}

export function getFirestore() {
  return db;
}

export function getStorage() {
  return storage;
}

export function getAnalytics() {
  return analytics;
}