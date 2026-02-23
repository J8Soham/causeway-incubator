import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { ConsentAnimations } from './consent.animations';
import { Router } from '@angular/router';
import { User, AccessState } from 'src/app/core/store/user/user.model';
import { Location } from '@angular/common';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { UserStore } from 'src/app/core/store/user/user.store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: ConsentAnimations,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NavbarComponent,
    MatCheckbox,
  ],
})
export class ConsentComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly userStore = inject(UserStore);

  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** Constants for onboarding templates. */
  appName = 'APP_NAME [Causeway]';
  shortProdDesc = 'PROD_DESC [provides users with opportunities to learn coding in real-world settings while contributing to non-profit causes]';
  shortResearchDesc = 'RESEARCH_DESC [how to scale opportunities for experiential learning and support collaboration around social causes]';
  authAppName = 'AUTH_APP_NAME [Google]';
  protocolNumber = 'PROTOCOL_NO [HS-FY2022-254]';
  protocolTitle = 'PROTOCOL_TITLE [Scaling Experiential Learning of Web Development]';
  usageDataProductDesc = 'USAGE_DATA_PROD [help users learn and contribute to projects they are participating in. When you participate in a project, your task information, status, and code will be shared with the project team]';
  usageDataResearchDesc = 'USAGE_DATA_RESEARCH [how to better support experiential learning online]';
  studyDoingDesc = 'STUDY_DOING [When you participate in our study, you will use our platform to learn web development and contribute code to a platform. You will also fill out a survey on your experience, and optionally, participate in a follow-up interview]';
  benefitsDesc = 'STUDY_BENEFITS [to learn web development and contribute to a project you care about]';
  investigatorInfo = 'INVESTIGATOR_INFO [FirstName LastName, co-Principal Investigator, email@ucsc.edu]';
  facultyInfo = 'FACULTY_INFO [David T. Lee, dlee105@ucsc.edu]';

  /** Checkbox state used in form. */
  checkForm = this.form.group({
    checked: [false, Validators.requiredTrue],
  });

  /** Consent url. */
  consentUrl: string;

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------

  /** Submit the consent form. */
  async submit() {
    try {
      await this.userStore.update(this.currentUser().__id, {
        accessState: AccessState.SUBMIT_INTEREST,
        consented: true,
      });
      this.router.navigate(['/early-access']);
    } catch (e) {
      console.error(e);
      this.snackBar.open('Failed to update consent status', '', { duration: 3000 });
    }
  }

  // --------------- OTHER -------------------------------

  constructor(
    private router: Router,
    private form: FormBuilder,
    private snackBar: MatSnackBar,
    private location: Location,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
    private injector: Injector,
  ) {
  }

  // --------------- LOAD AND CLEANUP --------------------

  ngOnInit() {
    this.consentUrl = location.origin + '/' + this.location.prepareExternalUrl('consent');
  }
}
