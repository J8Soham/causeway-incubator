import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { SidebarTocAnimations } from './sidebar-toc.animations';
import { Role } from 'src/app/core/store/role/role.model';
import { Subgoal } from 'src/app/core/store/subgoal/subgoal.model';
import { ROLE_ICON_MAP } from '../shared/role-icons';

@Component({
  selector: 'app-sidebar-toc',
  templateUrl: './sidebar-toc.component.html',
  styleUrls: ['./sidebar-toc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: SidebarTocAnimations,
  standalone: true,
  imports: [],
})
export class SidebarTocComponent {

  // --------------- INPUTS AND OUTPUTS ------------------

  /** All roles to display. */
  roles = input.required<Role[]>();

  /** All subgoals. */
  subgoals = input.required<Subgoal[]>();

  // --------------- OUTPUTS ------------------

  /** Emits role id when a role heading is clicked. */
  roleClicked = output<string>();

  // --------------- METHODS ----------------------------

  /** Get icon path for a role. */
  getIconPath(roleName: string): string {
    return ROLE_ICON_MAP[roleName]?.icon || '';
  }

  /** Get color for a role. */
  getRoleColor(roleName: string): string {
    return ROLE_ICON_MAP[roleName]?.color || '#5f6368';
  }

  /** Get subgoals for a given role. */
  getSubgoals(roleId: string): Subgoal[] {
    return this.subgoals()
      .filter(sg => sg.__roleId === roleId)
      .sort((a, b) => a.order - b.order);
  }

  /** Handle role heading click — scrolls to section. */
  onRoleClick(roleId: string) {
    this.roleClicked.emit(roleId);
    const el = document.getElementById('role-' + roleId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
