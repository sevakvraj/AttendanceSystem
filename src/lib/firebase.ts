import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXtxjZQPTzaRv4DjDrreu0l1X88Ia1Y2U",
  authDomain: "mca-attendance.firebaseapp.com",
  projectId: "mca-attendance",
  storageBucket: "mca-attendance.firebasestorage.app",
  messagingSenderId: "364083431722",
  appId: "1:364083431722:web:6edb6db0862e28332d7653"
};

// Initialize Firebase only if it hasn't been initialized yet
let app;
export let db: any;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  // Using long polling fixes "client is offline" issues on restricted networks
  db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  });
} else {
  app = getApp();
  db = getFirestore(app);
}

export const auth = getAuth(app);
