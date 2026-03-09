import { Timestamp } from '@angular/fire/firestore';
import { StudentProgress } from './student-progress.model';
import { withEntitiesForMockDB } from 'src/app/core/store/app.store';
import { signalStore } from '@ngrx/signals';

export const StudentProgressMockDB = signalStore(
  { providedIn: 'root' },
  withEntitiesForMockDB<StudentProgress>(),
);

export const STUDENTPROGRESS_DB = [
];
