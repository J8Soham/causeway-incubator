import { inject, Component, OnInit, ChangeDetectionStrategy, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class LoginComponent implements OnInit {
  authStore = inject(AuthStore);
  private readonly router = inject(Router);

  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** The email entered by the user. */
  email = '';

  // --------------- COMPUTED DATA -----------------------

  /** Whether the entered email is valid. */
  isEmailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  // --------------- EVENT HANDLING ----------------------

  /** Handle Continue button click — login with email via Google OAuth for now. */
  onContinue() {
    if (this.isEmailValid()) {
      this.authStore.login('google.com');
    }
  }

  /** Handle Continue as Guest click — navigate directly to main screen. */
  onContinueAsGuest() {
    this.router.navigate(['/home']);
  }

  /** Login the user (legacy). */
  login() {
    this.authStore.login('google.com', { doNotRoute: true });
  }

  /** Logout the user. */
  logout() {
    this.authStore.logout({ doNotRoute: true });
  }

  // --------------- OTHER -------------------------------

  constructor() {
  }

  // --------------- LOAD AND CLEANUP --------------------

  ngOnInit() {
  }
}
