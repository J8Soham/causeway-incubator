import { Component, OnInit, ChangeDetectionStrategy, inject, WritableSignal, Signal, signal, computed, Injector, effect } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { CourseStore } from 'src/app/core/store/course/course.store';
import { RoleStore } from 'src/app/core/store/role/role.store';
import { SubgoalStore } from 'src/app/core/store/subgoal/subgoal.store';
import { SubsubgoalStore } from 'src/app/core/store/subsubgoal/subsubgoal.store';
import { StudentProgressStore } from 'src/app/core/store/student-progress/student-progress.store';
import { Course } from 'src/app/core/store/course/course.model';
import { Role } from 'src/app/core/store/role/role.model';
import { Subgoal } from 'src/app/core/store/subgoal/subgoal.model';
import { Subsubgoal } from 'src/app/core/store/subsubgoal/subsubgoal.model';
import { StudentProgress, StepStatus } from 'src/app/core/store/student-progress/student-progress.model';
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component';
import { CurriculumGridComponent } from '../curriculum-grid/curriculum-grid.component';
import { SidebarTocComponent } from '../sidebar-toc/sidebar-toc.component';
import { RoleCoachComponent } from '../role-coach/role-coach.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NavbarComponent,
    CurriculumGridComponent,
    SidebarTocComponent,
    RoleCoachComponent,
    MatProgressBarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class HomeComponent implements OnInit {
  private readonly injector = inject(Injector);
  private readonly router = inject(Router);
  readonly authStore = inject(AuthStore);
  readonly courseStore = inject(CourseStore);
  readonly roleStore = inject(RoleStore);
  readonly subgoalStore = inject(SubgoalStore);
  readonly subsubgoalStore = inject(SubsubgoalStore);
  readonly studentProgressStore = inject(StudentProgressStore);

  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** Loading state. */
  loading: WritableSignal<boolean> = signal(true);

  /** Error state message. */
  errorMessage: WritableSignal<string> = signal('');

  // --------------- CONSTANTS --------------------------

  /** Only these 3 roles are active for the current clone. */
  private readonly ACTIVE_ROLES = ['Components', 'Containers', 'Applications'];

  // --------------- COMPUTED DATA -----------------------

  /** All courses. */
  courses = computed(() => this.courseStore.selectEntities([], {}));

  /** The primary course. */
  course = computed(() => {
    const allCourses = this.courses();
    return allCourses.length > 0 ? allCourses[0] : null;
  });

  /** Active roles only (Components, Containers, Applications), sorted by order. */
  roles = computed(() =>
    this.roleStore.selectEntities([], { orderBy: 'order' })
      .filter(r => this.ACTIVE_ROLES.includes(r.name))
  );

  /** All subgoals. */
  subgoals = computed(() => this.subgoalStore.selectEntities([], {}));

  /** All subsubgoals. */
  subsubgoals = computed(() => this.subsubgoalStore.selectEntities([], {}));

  /** Student progress. */
  progress = computed(() => {
    const all = this.studentProgressStore.selectEntities([], {});
    return all.length > 0 ? all[0] : null;
  });

  /** Progress map. */
  progressMap = computed<{ [key: string]: StepStatus }>(() => {
    const p = this.progress();
    return p?.stepStatuses || {};
  });

  /** Overall progress percentage. */
  overallProgress = computed(() => {
    const total = this.subsubgoals().length;
    if (total === 0) return 0;
    const map = this.progressMap();
    const completed = Object.values(map).filter(
      s => s === StepStatus.COMPLETE || s === StepStatus.SIMILAR_COMPLETED
    ).length;
    return Math.round((completed / total) * 100);
  });

  /** Next uncompleted step. */
  nextStep = computed(() => {
    const map = this.progressMap();
    const roles = this.roles();
    const subgoals = this.subgoals();
    const subsubgoals = this.subsubgoals();

    for (const role of roles) {
      const roleSubgoals = subgoals
        .filter(sg => sg.__roleId === role.__id)
        .sort((a, b) => a.order - b.order);

      for (const subgoal of roleSubgoals) {
        const steps = subsubgoals
          .filter(ssg => ssg.__subgoalId === subgoal.__id)
          .sort((a, b) => a.order - b.order);

        for (const step of steps) {
          const status = map[step.__id] || StepStatus.NOT_STARTED;
          if (status === StepStatus.NOT_STARTED || status === StepStatus.IN_PROGRESS) {
            return { roleName: role.name, subgoalName: subgoal.name, subsubgoal: step };
          }
        }
      }
    }
    return null;
  });

  // --------------- LOAD AND CLEANUP --------------------

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      // Stream all courses
      this.courseStore.stream([], { orderBy: 'order' }, this.injector);

      // Stream all roles
      this.roleStore.stream([], { orderBy: 'order' }, this.injector);

      // Stream all subgoals
      this.subgoalStore.stream([], { orderBy: 'order' }, this.injector);

      // Stream all subsubgoals
      this.subsubgoalStore.stream([], { orderBy: 'order' }, this.injector);

      // Stream student progress for current user
      effect(() => {
        const user = this.currentUser();
        if (user?.__id) {
          this.studentProgressStore.stream(
            [['__userId', '==', user.__id]],
            {},
            this.injector,
          );
        }
      }, { injector: this.injector });

      this.loading.set(false);
    } catch (e) {
      console.error('Failed to load data:', e);
      this.errorMessage.set('Failed to load curriculum data. Please try again.');
      this.loading.set(false);
    }
  }

  /** Retry loading data after error. */
  retry() {
    this.loadData();
  }

  /** Handle step click — navigate to the learn page. */
  onStepClicked(stepId: string) {
    this.router.navigate(['/learn', stepId]);
  }
}
