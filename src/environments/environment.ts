// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mockDB: false,
  firebase: {
    apiKey: import.meta.env.NG_APP_FIREBASE_DEV_API_KEY,
    authDomain: "causeway-incubator-dev.firebaseapp.com",
    projectId: "causeway-incubator-dev",
    storageBucket: "causeway-incubator-dev.firebasestorage.app",
    messagingSenderId: "174824312685",
    appId: "1:174824312685:web:032c582afb1f76ccd4d464"
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error'; // Included with Angular CLI.
