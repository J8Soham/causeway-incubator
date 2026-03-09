import { Timestamp } from '@angular/fire/firestore';
import { Role } from './role.model';
import { withEntitiesForMockDB } from 'src/app/core/store/app.store';
import { signalStore } from '@ngrx/signals';

export const RoleMockDB = signalStore(
  { providedIn: 'root' },
  withEntitiesForMockDB<Role>(),
);

export const ROLE_DB = [
];
