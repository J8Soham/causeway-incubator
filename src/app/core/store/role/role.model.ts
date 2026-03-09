import { Timestamp } from '@angular/fire/firestore';

export interface Role {
  __id: string;
  __courseId: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  order: number;
  _createdAt?: Timestamp;
  _updatedAt?: Timestamp;
  _deleted?: boolean;
}
