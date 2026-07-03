import { firebaseConfig, storeId as fallbackStoreId } from "../firebase.example.js";

export function getFirebaseRuntimeConfig() {
  return {
    firebaseConfig: {
      apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey,
      authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
      projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
      storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket,
      messagingSenderId:
        import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId,
      appId: import.meta.env?.VITE_FIREBASE_APP_ID || firebaseConfig.appId
    },
    storeId: import.meta.env?.VITE_STORE_ID || fallbackStoreId
  };
}

export async function initializeFirebase() {
  const { initializeApp } = await import("firebase/app");
  const { getFirestore } = await import("firebase/firestore");
  const { firebaseConfig: config, storeId } = getFirebaseRuntimeConfig();
  const app = initializeApp(config);

  return {
    app,
    db: getFirestore(app),
    storeId
  };
}
