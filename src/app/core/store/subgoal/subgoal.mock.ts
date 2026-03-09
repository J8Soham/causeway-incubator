import { Timestamp } from '@angular/fire/firestore';
import { Subgoal } from './subgoal.model';
import { withEntitiesForMockDB } from 'src/app/core/store/app.store';
import { signalStore } from '@ngrx/signals';

export const SubgoalMockDB = signalStore(
  { providedIn: 'root' },
  withEntitiesForMockDB<Subgoal>(),
);

export const SUBGOAL_DB = [
];
