import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { RoleSectionAnimations } from './role-section.animations';
import { Role } from 'src/app/core/store/role/role.model';
import { Subgoal } from 'src/app/core/store/subgoal/subgoal.model';
import { Subsubgoal } from 'src/app/core/store/subsubgoal/subsubgoal.model';
import { StepStatus } from 'src/app/core/store/student-progress/student-progress.model';
import { StepIconComponent } from '../step-icon/step-icon.component';
import { ROLE_ICON_MAP } from '../shared/role-icons';

@Component({
  selector: 'app-role-section',
  templateUrl: './role-section.component.html',
  styleUrls: ['./role-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: RoleSectionAnimations,
  standalone: true,
  imports: [
    StepIconComponent,
  ],
})
export class RoleSectionComponent {

  // --------------- INPUTS AND OUTPUTS ------------------

  /** The role to render. */
  role = input.required<Role>();

  /** All subgoals (will be filtered by this role's id). */
  allSubgoals = input.required<Subgoal[]>();

  /** All subsubgoals (will be filtered per subgoal). */
  allSubsubgoals = input.required<Subsubgoal[]>();

  /** Progress map (subsubgoalId → status). */
  progressMap = input.required<{ [key: string]: StepStatus }>();

  // --------------- OUTPUTS ------------------

  /** Emits step id when a step icon is clicked. */
  stepClicked = output<string>();

  // --------------- COMPUTED DATA -----------------------

  /** Hexagon SVG icon path for this role. */
  roleIconPath = computed(() => ROLE_ICON_MAP[this.role().name]?.icon || '');

  /** Subgoals belonging to this role, sorted by order. */
  subgoals = computed(() => {
    const roleId = this.role().__id;
    return this.allSubgoals()
      .filter(sg => sg.__roleId === roleId)
      .sort((a, b) => a.order - b.order);
  });

  /** Get subsubgoals for a given subgoal, sorted by order. */
  getSubsubgoals(subgoalId: string): Subsubgoal[] {
    return this.allSubsubgoals()
      .filter(ssg => ssg.__subgoalId === subgoalId)
      .sort((a, b) => a.order - b.order);
  }

  /** Get the status for a given subsubgoal. */
  getStatus(subsubgoalId: string): StepStatus {
    return this.progressMap()[subsubgoalId] || StepStatus.NOT_STARTED;
  }

  // --------------- EVENT HANDLING ----------------------

  /** Bubble up step click events. */
  onStepClicked(stepId: string) {
    this.stepClicked.emit(stepId);
  }
}
