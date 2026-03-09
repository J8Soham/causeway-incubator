import { Timestamp } from '@angular/fire/firestore';

export enum StepType {
  CONCEPT = 'concept',
  TASK = 'task',
  REVIEW = 'review',
}

export interface Subsubgoal {
  __id: string;
  __subgoalId: string;
  name: string;
  type: StepType;
  order: number;
  _createdAt?: Timestamp;
  _updatedAt?: Timestamp;
  _deleted?: boolean;
}
