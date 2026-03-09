import { Timestamp } from '@angular/fire/firestore';

export interface Subgoal {
  __id: string;
  __roleId: string;
  name: string;
  order: number;
  _createdAt?: Timestamp;
  _updatedAt?: Timestamp;
  _deleted?: boolean;
}
