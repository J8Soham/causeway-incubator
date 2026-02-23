import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { AdminPanelAnimations } from './admin-panel.animations';
import { User, AccessState } from '../../core/store/user/user.model';
import { AuthStore } from '../../core/store/auth/auth.store';
import { UserStore } from '../../core/store/user/user.store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgFor } from '@angular/common';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';

// If you add other columns, update this, e.g. AccessState | string | boolean;
type UpdateValueTypes = AccessState;

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: AdminPanelAnimations,
  standalone: true,
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatMenuTrigger,
    MatMenu,
    NgFor,
    MatMenuItem,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
  ],
})
export class AdminPanelComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly userStore = inject(UserStore);

  // --------------- INPUTS AND OUTPUTS ------------------

  // --------------- LOCAL UI STATE ----------------------

  /** Access options for menu sorted alphabetically. */
  accessOptions: AccessState[] = Object.keys(AccessState)
    .map((k) => AccessState[k] as AccessState)
    .sort((a, b) => {
      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      } else {
        return 0;
      }
    });

  /** Columns to display in the table */
  displayedColumns = ['userName', 'accessState'];

  // --------------- COMPUTED DATA -----------------------

  /** Get array of all waiting users. */
  waitingUsers: Signal<User[]> = computed(() => this.userStore.selectEntities([], { orderBy: 'accessState' }));

  // --------------- EVENT HANDLING ----------------------

  /** Event stream for updating user accessState. */
  async updateState(user: User, key: string, value: UpdateValueTypes) {
    const data = {};
    data[key] = value;

    try {
      await this.userStore.update(user.__id, { ...data });
      this.snackBar.open(`Set ${user.name}'s ${key} to ${value}`, '', { duration: 3000 });
    } catch (e) {
      console.error(e);
      this.snackBar.open('Failed to submit response', '', { duration: 3000 });
    }
  }

  // --------------- OTHER -------------------------------

  constructor(
    private snackBar: MatSnackBar,
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) {
  }

  // --------------- LOAD AND CLEANUP --------------------

  ngOnInit() {
    this.userStore.load([], {});
  }
}
