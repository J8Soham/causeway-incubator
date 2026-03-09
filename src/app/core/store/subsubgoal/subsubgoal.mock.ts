import { Timestamp } from '@angular/fire/firestore';
import { Subsubgoal } from './subsubgoal.model';
import { withEntitiesForMockDB } from 'src/app/core/store/app.store';
import { signalStore } from '@ngrx/signals';

export const SubsubgoalMockDB = signalStore(
  { providedIn: 'root' },
  withEntitiesForMockDB<Subsubgoal>(),
);

export const SUBSUBGOAL_DB = [
];
