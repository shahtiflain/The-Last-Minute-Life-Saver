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
    console.log("Firebase Admin initialized securely from file.");
  } catch (error) {
    console.warn("Could not find serviceAccountKey.json, checking environment variables...");
    
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      privateKey = privateKey.replace(/^["']|["']$/g, ''); // Remove surrounding quotes if any
      privateKey = privateKey.replace(/\\n/g, '\n'); // Convert escaped newlines

      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        })
      });
      console.log("Firebase Admin initialized securely from environment variables.");
    } else {
      console.warn("Missing Firebase environment variables. Attempting default initialization...");
      initializeApp();
    }
  }
}