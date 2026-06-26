import { getApps, initializeApp } from 'firebase-admin/app';
import dotenv from 'dotenv';

dotenv.config();

if (!getApps().length) {
  initializeApp();
}
