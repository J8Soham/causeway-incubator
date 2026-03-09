import { Component, OnInit, ChangeDetectionStrategy, inject, Signal, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LandingAnimations } from './landing.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: LandingAnimations,
  standalone: true,
  imports: [
    MatButtonModule,
  ],
})
export class LandingComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------

  /** Navigate to the login page. */
  onGetStarted() {
    this.router.navigate(['/login']);
  }

  /** Login the user (legacy — kept for backward compatibility). */
  login() {
    this.authStore.login('google.com');
  }

  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
  ) {
  }

  // --------------- LOAD AND CLEANUP --------------------

  ngOnInit() {
  }
}
