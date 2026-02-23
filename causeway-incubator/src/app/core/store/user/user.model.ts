import { Timestamp } from '@angular/fire/firestore';

/** user data */
export interface User {
  __id: string;
  _createdAt?: Timestamp;
  _updatedAt?: Timestamp;
  _deleted?: boolean;
  name: string;
  email: string;
  photoURL?: string;
  tokens?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [index: string]: any;
  };
  isAdmin: boolean;
  accessState: AccessState;
  consented: boolean;
  joinedWaitlistAt?: Timestamp;
}

export enum AccessState {
  CONSENT = '01 - consent', // on consent form
  SUBMIT_INTEREST = '02 - submit interest', // on basic interest form
  WAITING = '03 - waiting', // on waitlist for early access
  DONE = 'done', // finished with the access flow
}
