import { getApps, initializeApp, cert } from 'firebase-admin/app';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

if (!getApps().length) {
  try {
    const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    initializeApp({
      credential: cert(serviceAccount)
    });
    console.log("Firebase Admin initialized securely.");
  } catch (error) {
    console.warn("Could not find serviceAccountKey.json, attempting default initialization...");
    initializeApp();
  }
}