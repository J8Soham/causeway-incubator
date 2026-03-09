import { Timestamp } from '@angular/fire/firestore';

export interface Course {
  __id: string;
  title: string;
  subtitle: string;
  description: string;
  order: number;
  _createdAt?: Timestamp;
  _updatedAt?: Timestamp;
  _deleted?: boolean;
}
