import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, computed, Inject, input, output, inject, signal, WritableSignal, Signal, Injector } from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import { EarlyAccessAnimations } from './early-access.animations';
import { WaitlistData } from './early-access.model';
import { User, AccessState } from 'src/app/core/store/user/user.model';
import { UserContext } from 'src/app/core/store/user-context/user-context.model';
import { Timestamp, serverTimestamp } from 'firebase/firestore';
import { FormBuilder, Validators, ValidatorFn, ValidationErrors, AbstractControl, FormGroup, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { UserStore } from 'src/app/core/store/user/user.store';
import { UserContextStore } from 'src/app/core/store/user-context/user-context.store';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { NgFor, AsyncPipe } from '@angular/common';
import { MatLabel, MatFormField, MatError, MatHint } from '@angular/material/form-field';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component';

@Component({
  selector: 'app-early-access',
  templateUrl: './early-access.component.html',
  styleUrls: ['./early-access.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: EarlyAccessAnimations,
  standalone: true,
  imports: [
    NavbarComponent,
    FormsModule,
    MatLabel,
    ReactiveFormsModule,
    NgFor,
    MatCheckbox,
    MatFormField,
    MatInput,
    MatHint,
    MatError,
    MatProgressSpinner,
    AsyncPipe,
  ],
})
export class EarlyAccessComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly userStore = inject(UserStore);
  readonly userContextStore = inject(UserContextStore);

  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** Loading indicator. */
  loading: WritableSignal<boolean> = signal(false);

  // this allows the template to use the enum
  AccessState = AccessState;

  // Template constants
  appName = 'APP_NAME [Causeway]';
  appArea = 'APP_AREA [learning web development]';
  outreachLeadName = 'OUTREACH_LEAD_NAME [FirstName LastName]';
  outreachLeadEmail = 'OUTREACH_LEAD_EMAIL [email@ucsc.edu]';

  /** One checkbox must be selected. If other is selected, the text needs to be filled out */
  oneCheckedValidator: ValidatorFn = (
    form: FormGroup,
  ): ValidationErrors | null => {
    const otherText = form.get('backgroundOther').value;
    const selectionsArray = form.get('backgroundSelections') as FormArray;
    const selected = selectionsArray.controls
      .filter((item) => item.value.checked);

    const needsOtherText = selectionsArray.controls.filter((item) => item.value.fieldName === 'other' && item.value.checked).length > 0 && otherText.trim().length === 0;

    return selected.length === 0 || needsOtherText ? {
      ...(selected.length === 0 ? { noneChecked: true } : {}),
      ...(needsOtherText ? { needsOtherText } : {}),
    }: null;
  };

  /** Form controls for early access survey. */
  backgroundForm = this.form.group({
    desiredValue: ['', Validators.minLength(50)],
    backgroundOther: [{ value: '', disabled: true }, Validators.required],
    backgroundSelections: this.form.array([
      this.form.group({
        fieldName: 'option1',
        label: 'OPTION_1 [Student trying to get hands-on experience]',
        ariaLabel: 'OPTION_1_AREA',
        checked: false,
      }),
      this.form.group({
        fieldName: 'option2',
        label: 'OPTION_2 [Educator exploring new ways to teach]',
        ariaLabel: 'OPTION_2_ARIA',
        checked: false,
      }),
      this.form.group({
        fieldName: 'option3',
        label: 'OPTION_3 [Professional wanting to contribute to a cause]',
        ariaLabel: 'OPTION_3_ARIA',
        checked: false,
      }),
      this.form.group({
        fieldName: 'other',
        label: 'Other (none are a perfect fit)',
        ariaLabel: 'Other',
        checked: false,
      })
    ])
  }, { validators: this.oneCheckedValidator });

  /** Convenience getter for desiredValue. */
  get desiredValue() {
    return this.backgroundForm.get('desiredValue');
  }

  /** Convenience getter for backgroundOther. */
  get backgroundOther() {
    return this.backgroundForm.get('backgroundOther');
  }

  /** Getter for backgroundSelections form array with a type for use of controls. */
  get backgroundSelections() {
    return this.backgroundForm.get('backgroundSelections') as FormArray;
  }
 
  // --------------- COMPUTED DATA -----------------------

  /** Waitlist data from app-state, user, and user-context. */
  waitlistData: Signal<WaitlistData> = computed(() => {
    const userContext = this.userContextStore.selectFirst([['__userId', '==', this.currentUser().__id]], {});
    return { currentUser: this.currentUser(), userContext };
  });

  /** Waiting position number. */
  positionText$: Observable<string> = toObservable(this.currentUser).pipe(
    filter((user: User) => !!user.joinedWaitlistAt),
    mergeMap(async (user) => {
      const posNum = await this.userStore.count([
        ['joinedWaitlistAt', '<=', user.joinedWaitlistAt],
        ['accessState', '==', AccessState.WAITING],
      ], {});
      return this.nth(posNum);
    }),
  );

  /** Waiting position number. */
  totalWaiting$: Observable<string> = toObservable(this.currentUser).pipe(
    filter((user: User) => !!user.joinedWaitlistAt),
    mergeMap(async (user) => {
      const total = await this.userStore.count([
        ['accessState', '==', AccessState.WAITING],
      ], {});
      return `${total}`;
    }),
  );

  /** Function for adding the appropriate suffix. */
  nth(n: number): string {
    switch (n % 10) {
      case 1: return `${n}st`;
      case 2: return `${n}nd`;
      case 3: return `${n}rd`;
      default: return `${n}th`;
    }
  }

  /** Get all options that were selected. */
  getSelections(): string[] {
    return this.backgroundSelections.controls
      .filter((item) => item.value.checked)
      .map((item) => item.value.fieldName);
  }

  // --------------- EVENT HANDLING ----------------------

  /** 
   * Enable and disable the backgroundOther text input depending on if other is checked.
   * It is important that the form model is the source of truth not the template, so if we want
   * the validation to go away when the input is no longer needed, it needs to be disabled on the model
   * rather than just hidden from the view.
   */
  check(item) {
    if (item.value.fieldName === 'other' && item.value.checked) {
      this.backgroundForm.controls.backgroundOther.enable();
    } else if (item.value.fieldName === 'other' && !item.value.checked) {
      this.backgroundForm.controls.backgroundOther.disable();
    }
  }

  /** Submit background and interests. */
  async submitInterest() {
    try {
      await this.batch.batchWrite(async (batchConfig) => {
        await this.userStore.update(this.waitlistData().currentUser.__id, {
          accessState: AccessState.WAITING,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          joinedWaitlistAt: Timestamp.now(),
        }, { batchConfig });

        if (this.waitlistData().userContext) {
          this.userContextStore.update(this.waitlistData().userContext.__id, {
            background: {
              selections: this.getSelections(),
              ...(this.backgroundOther.value ? { other: this.backgroundOther.value } : { }),
            },
            desiredValue: this.desiredValue.value,
          }, { batchConfig });
        } else {
          this.userContextStore.add({
            __userId: this.waitlistData().currentUser.__id,
            background: {
              selections: this.getSelections(),
              ...(this.backgroundOther.value ? { other: this.backgroundOther.value } : { }),
            },
            desiredValue: this.desiredValue.value,
          }, { batchConfig });
        }
      }, {
        loading: this.loading,
        snackBarConfig: {
          successMessage: 'Submitted interest form!',
          failureMessage: 'Failed to submit response',
          undoOnAction: true,
          config: { duration: 3000 },
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  // --------------- OTHER -------------------------------

  constructor(
    private snackBar: MatSnackBar,
    private form: FormBuilder,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
    private injector: Injector,
  ) {
  }

  // --------------- LOAD AND CLEANUP --------------------

  ngOnInit() {
    this.userContextStore.load([['__userId', '==', this.currentUser().__id]], {});
  }
}
