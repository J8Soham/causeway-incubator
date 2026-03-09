import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, Signal, inject, WritableSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { HomeAnimations } from './home.animations';
import { MatTabGroup, MatTab, MatTabContent } from '@angular/material/tabs';
import { LongTermGoalsComponent } from './long-term-goals/long-term-goals.component';
import { QuarterlyGoalsComponent } from './quarterly-goals/quarterly-goals.component';
import { WeeklyGoalsComponent } from './weekly-goals/weekly-goals.component';
import { TimeHeaderComponent } from './time-header/time-header.component';
import { NotesPageComponent } from './notes-page/notes-page.component';
import { QuarterlyGoal } from 'src/app/core/store/quarterly-goal/quarterly-goal.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: HomeAnimations,
  imports: [
    TimeHeaderComponent,
    WeeklyGoalsComponent,
    QuarterlyGoalsComponent,
    LongTermGoalsComponent,
    MatTabGroup,
    MatTab,
    MatTabContent,
    NotesPageComponent,
  ],
})
export class HomeComponent {
  private breakpointObserver = inject(BreakpointObserver);

  // --------------- INPUTS AND OUTPUTS ------------------

  // --------------- LOCAL UI STATE ----------------------

  /** Boolean signal determining whether the notes page is showing */
  showNotesPage: WritableSignal<boolean> = signal(false);

  /** For storing the specific quarterly goal that user clicked on */
  quarterlyGoalClicked: WritableSignal<QuarterlyGoal | null> = signal(null);

  // --------------- COMPUTED DATA -----------------------

  /** Signal for detecting screen size */
  isSmallScreen: Signal<boolean> = toSignal(
    this.breakpointObserver.observe('(max-width: 850px)')
        .pipe(map((state) => {
          return state.matches;
        })),
  );

  // --------------- EVENT HANDLING ----------------------

  /**
   * Handles the click event on a goal and sets the quarterly goal signal to ensure that the correct notes are displayed for quarterly goal or long term goal.
   */
  handleGoalClicked(goal: QuarterlyGoal | null) {
    if (goal) {
      this.quarterlyGoalClicked.set(goal);
    } else {
      this.quarterlyGoalClicked.set(null);
    }
    this.showNotesPage.set(true);
  }

  /**
   * Closes the notes page and resets the quarterly goal signal.
   */
  handleNotesClose() {
    this.showNotesPage.set(false);
    this.quarterlyGoalClicked.set(null);
  }

  // --------------- OTHER -------------------------------

  // --------------- LOAD AND CLEANUP --------------------
}
