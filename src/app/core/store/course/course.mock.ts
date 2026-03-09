import { Timestamp } from '@angular/fire/firestore';
import { Course } from './course.model';
import { withEntitiesForMockDB } from 'src/app/core/store/app.store';
import { signalStore } from '@ngrx/signals';

export const CourseMockDB = signalStore(
  { providedIn: 'root' },
  withEntitiesForMockDB<Course>(),
);

export const COURSE_DB = [
];
