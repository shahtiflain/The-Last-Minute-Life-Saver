import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const isMock = import.meta.env.VITE_MOCK_AUTH === 'true';

export const app = (!isMock && firebaseConfig.apiKey) ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const messaging = app && typeof window !== 'undefined' && firebaseConfig.projectId ? getMessaging(app) : null;

export const requestNotificationPermission = async () => {
  if (!messaging) return null;
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const swRegistration = await navigator.serviceWorker.register(
        `/firebase-messaging-sw.js?apiKey=${firebaseConfig.apiKey}&projectId=${firebaseConfig.projectId}&messagingSenderId=${firebaseConfig.messagingSenderId}&appId=${firebaseConfig.appId}`
      );
      const token = await getToken(messaging, {
        serviceWorkerRegistration: swRegistration,
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY // optional but recommended
      });
      return token;
    }
  } catch (err) {
    console.error('Failed to get FCM token', err);
  }
  return null;
};

export const onForegroundMessage = () => {
  if (!messaging) return () => {};
  return onMessage(messaging, (payload) => {
    console.log('[Foreground Message]', payload);
    // Let the app handle it (e.g. show toast)
  });
};

export default app;
