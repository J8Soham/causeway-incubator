import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { StepIconAnimations } from './step-icon.animations';
import { Subsubgoal, StepType } from 'src/app/core/store/subsubgoal/subsubgoal.model';
import { StepStatus } from 'src/app/core/store/student-progress/student-progress.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-step-icon',
  templateUrl: './step-icon.component.html',
  styleUrls: ['./step-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: StepIconAnimations,
  standalone: true,
  imports: [
    MatTooltipModule,
    MatIconModule,
    NgClass,
  ],
})
export class StepIconComponent {

  // --------------- INPUTS AND OUTPUTS ------------------

  /** The subsubgoal (step) data. */
  step = input.required<Subsubgoal>();

  /** The progress status of this step. */
  status = input<StepStatus>(StepStatus.NOT_STARTED);

  /** The role color (used when status is not_started to show faded role color). */
  roleColor = input<string>('#e8eaed');

  // --------------- OUTPUTS ------------------

  /** Emits the step id when clicked. */
  clicked = output<string>();

  // --------------- COMPUTED DATA -----------------------

  /** CSS class based on progress status. */
  statusClass = computed(() => {
    switch (this.status()) {
      case StepStatus.COMPLETE: return 'status-complete';
      case StepStatus.IN_PROGRESS: return 'status-in-progress';
      case StepStatus.SIMILAR_COMPLETED: return 'status-similar-completed';
      default: return 'status-not-started';
    }
  });

  /** Material icon name based on step type. */
  typeIcon = computed(() => {
    switch (this.step().type) {
      case StepType.CONCEPT: return 'lightbulb';
      case StepType.TASK: return 'code';
      case StepType.REVIEW: return 'rate_review';
      default: return 'circle';
    }
  });

  /** Background color for the block based on status. */
  blockColor = computed(() => {
    switch (this.status()) {
      case StepStatus.COMPLETE: return '#202124';
      case StepStatus.IN_PROGRESS: return this.roleColor();
      case StepStatus.SIMILAR_COMPLETED: return '#9e9e9e';
      default: return this.roleColor() + '40'; // 25% opacity
    }
  });

  // --------------- EVENT HANDLING ----------------------

  /** Handle step icon click. */
  onClick() {
    this.clicked.emit(this.step().__id);
  }
}
