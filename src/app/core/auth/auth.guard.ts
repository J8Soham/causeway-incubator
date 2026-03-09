import { Inject, inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { User, AccessState } from '../store/user/user.model';
import { AuthStore } from '../store/auth/auth.store';
import { filter, switchMap, take } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { DATABASE_SERVICE, DatabaseService } from '../firebase/database.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  readonly authStore = inject(AuthStore);
  user$: Observable<User>;

  constructor(
    private router: Router,
    @Inject(DATABASE_SERVICE) private db: DatabaseService,
  ) {
    // This is only used when we have a signed in user, so we want to filter
    // out the values before the user has been loaded into the store
    this.user$ = toObservable(this.authStore.user).pipe(
      filter((user) => !!user),
    );
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.db.afUser().pipe(
      switchMap((afUser) => afUser ? this.user$.pipe(take(1)) : of(null)),
      switchMap((dbUser) => {
        // The overall approach is that we have a sequence of things we need to check (signed in, consent, waiting, walkthrough).
        // - For each, we want to make sure people not past that stage can't see past it,
        // - We also want to make sure people already past that stage get auto-moved past that page,
        // - We preserve queryParams in case we want to support things like referral links in the future,
        // - Admin users are also handled (so that only admin users can go to admin pages, including pages they would
        //   typically get rerouted from)

        // First handle all not logged in cases. If not logged in, users can only go to landing, login, or home (guest)
        if (!dbUser) {
          if (state.url === '/' || state.url === '/landing' || state.url === '/login' || state.url === '/home') {
            return of(true);
          } else {
            this.router.navigate(['/'], { queryParams: next.queryParams });
            return of(false);
          }
        }

        // AFTER THIS POINT, THE USER MUST BE LOGGED IN (i.e. dbUser exists)

        // If logged in and trying to access landing, redirect to the homepage
        if (state.url === '/' || state.url === '/landing' || state.url === '/login') {
          this.router.navigate(['/home'], { queryParams: next.queryParams });
          return of(false);
        }

        // Make sure non-admin users can't visit admin pages and admin users can visit any page
        // Note: this also means there isn't the same auto-redirection/authguard behavior for admins
        if (!dbUser.isAdmin && state.url.startsWith('/admin')) {
          this.router.navigate(['/home'], { queryParams: next.queryParams });
          return of(false);
        } else if (dbUser.isAdmin) {
          return of(true);
        }

        // Then handle whether users have consented. If not, go to consent, otherwise skip past consent.
        if ((!dbUser.consented || dbUser.accessState === AccessState.CONSENT) && state.url !== '/consent') {
          this.router.navigate(['/consent'], { queryParams: next.queryParams });
          return of(false);
        } else if ((!dbUser.consented || dbUser.accessState === AccessState.CONSENT) && state.url === '/consent') {
          return of(true);
        } else if (dbUser.consented && dbUser.accessState !== AccessState.CONSENT && state.url === '/consent') {
          this.router.navigate(['/early-access'], { queryParams: next.queryParams });
          return of(false);
        }

        // Then handle whether users are past waitlist. If not, go to waiting, otherwise skip past waiting.
        const waitingStates = [AccessState.SUBMIT_INTEREST, AccessState.WAITING];
        if (waitingStates.includes(dbUser.accessState) && state.url !== '/early-access') {
          this.router.navigate(['/early-access'], { queryParams: next.queryParams });
          return of(false);
        } else if (waitingStates.includes(dbUser.accessState) && state.url === '/early-access') {
          return of(true);
        } else if (!waitingStates.includes(dbUser.accessState) && state.url === '/early-access') {
          this.router.navigate(['/home'], { queryParams: next.queryParams });
          return of(false);
        }

        // PLACEHOLDER: Add similar logic to waitlist states if there is an app-specific walkthrough process

        // For anything else, return true
        return of(true);
      }),
    );
  }
}
