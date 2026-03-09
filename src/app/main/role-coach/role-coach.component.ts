import { Component, ChangeDetectionStrategy, input, signal, computed } from '@angular/core';
import { RoleCoachAnimations } from './role-coach.animations';
import { Role } from 'src/app/core/store/role/role.model';
import { Subgoal } from 'src/app/core/store/subgoal/subgoal.model';
import { ROLE_ICON_MAP } from '../shared/role-icons';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-role-coach',
  templateUrl: './role-coach.component.html',
  styleUrls: ['./role-coach.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: RoleCoachAnimations,
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
  ],
})
export class RoleCoachComponent {

  // --------------- INPUTS AND OUTPUTS ------------------

  /** All available roles for the dropdown. */
  roles = input.required<Role[]>();

  /** All subgoals. */
  subgoals = input.required<Subgoal[]>();

  // --------------- LOCAL UI STATE ----------------------

  /** Whether the popup is open. */
  isOpen = signal(false);

  /** Currently selected role id. */
  selectedRoleId = signal('');

  // --------------- COMPUTED DATA -----------------------

  /** The currently selected role object. */
  selectedRole = computed(() => {
    const id = this.selectedRoleId();
    return this.roles().find(r => r.__id === id) || this.roles()[0];
  });

  /** Subgoals for the selected role. */
  selectedSubgoals = computed(() => {
    const role = this.selectedRole();
    if (!role) return [];
    return this.subgoals()
      .filter(sg => sg.__roleId === role.__id)
      .sort((a, b) => a.order - b.order);
  });

  /** Display name for the floating button. */
  coachLabel = computed(() => {
    const role = this.selectedRole();
    return role ? `${role.name} Coach` : 'Role Coach';
  });

  /** Get icon path for a role. */
  getIconPath(roleName: string): string {
    return ROLE_ICON_MAP[roleName]?.icon || '';
  }

  /** Get color for a role. */
  getRoleColor(roleName: string): string {
    return ROLE_ICON_MAP[roleName]?.color || '#5f6368';
  }

  // --------------- EVENT HANDLING ----------------------

  /** Toggle the popup open/close. */
  toggle() {
    this.isOpen.update(v => !v);

    // Set initial selection if not set
    if (this.isOpen() && !this.selectedRoleId() && this.roles().length > 0) {
      this.selectedRoleId.set(this.roles()[0].__id);
    }
  }

  /** Close the popup. */
  close() {
    this.isOpen.set(false);
  }

  /** Handle role selection change. */
  onRoleChange(roleId: string) {
    this.selectedRoleId.set(roleId);
  }
}
