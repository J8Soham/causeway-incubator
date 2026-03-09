import { Timestamp } from '@angular/fire/firestore';

export enum StepStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETE = 'complete',
  SIMILAR_COMPLETED = 'similar_completed',
}

export interface StudentProgress {
  __id: string;
  __userId: string;
  stepStatuses: {
    [subsubgoalId: string]: StepStatus;
  };
  _createdAt?: Timestamp;
  _updatedAt?: Timestamp;
  _deleted?: boolean;
}
