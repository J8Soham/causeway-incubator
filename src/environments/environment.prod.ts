export const environment = {
  production: true,
  firebase: {
    apiKey: import.meta.env.NG_APP_FIREBASE_API_KEY,
    authDomain: "causeway-incubator-44cef.firebaseapp.com",
    projectId: "causeway-incubator-44cef",
    storageBucket: "causeway-incubator-44cef.firebasestorage.app",
    messagingSenderId: "720466910769",
    appId: "1:720466910769:web:95fe992b678df48c25ff10"
  },
  firebaseLogs: {
    apiKey: import.meta.env.NG_APP_FIREBASE_LOGS_API_KEY,
    authDomain: "causeway-incubator-logs-c86d4.firebaseapp.com",
    projectId: "causeway-incubator-logs-c86d4",
    storageBucket: "causeway-incubator-logs-c86d4.firebasestorage.app",
    messagingSenderId: "837732734488",
    appId: "1:837732734488:web:ffd5f30aa568cfd3c0556d"
  },
};
