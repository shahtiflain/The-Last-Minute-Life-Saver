// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
// Note: We use query params appended during registration, or just inject it if we have it.
// The easiest robust way is to just configure it here directly using URL params or fetch.
// But since we can't easily pass env vars to a static JS file without a bundler, 
// we will rely on firebase-messaging configuring itself if we initialize app with default options.
// Wait, we need the config here.
const firebaseConfig = {
  // We can listen to message events, but let's just grab the minimal config from the URL parameters 
  // passed when registering the service worker.
  apiKey: new URL(location).searchParams.get("apiKey"),
  projectId: new URL(location).searchParams.get("projectId"),
  messagingSenderId: new URL(location).searchParams.get("messagingSenderId"),
  appId: new URL(location).searchParams.get("appId"),
};

if (firebaseConfig.projectId) {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/favicon.svg'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}
