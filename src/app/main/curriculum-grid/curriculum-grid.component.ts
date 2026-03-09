import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CurriculumGridAnimations } from './curriculum-grid.animations';
import { Role } from 'src/app/core/store/role/role.model';
import { Subgoal } from 'src/app/core/store/subgoal/subgoal.model';
import { Subsubgoal } from 'src/app/core/store/subsubgoal/subsubgoal.model';
import { StepStatus } from 'src/app/core/store/student-progress/student-progress.model';
import { RoleSectionComponent } from '../role-section/role-section.component';

@Component({
  selector: 'app-curriculum-grid',
  templateUrl: './curriculum-grid.component.html',
  styleUrls: ['./curriculum-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: CurriculumGridAnimations,
  standalone: true,
  imports: [
    RoleSectionComponent,
  ],
})
export class CurriculumGridComponent {

  // --------------- INPUTS AND OUTPUTS ------------------

  /** All roles for the course, sorted. */
  roles = input.required<Role[]>();

  /** All subgoals. */
  subgoals = input.required<Subgoal[]>();

  /** All subsubgoals. */
  subsubgoals = input.required<Subsubgoal[]>();

  /** Progress map (subsubgoalId → status). */
  progressMap = input.required<{ [key: string]: StepStatus }>();

  // --------------- OUTPUTS ------------------

  /** Emits step id when a step is clicked. */
  stepClicked = output<string>();

  // --------------- EVENT HANDLING ----------------------

  /** Bubble up step click events. */
  onStepClicked(stepId: string) {
    this.stepClicked.emit(stepId);
  }
}
