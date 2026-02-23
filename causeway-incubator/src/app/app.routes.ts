import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { LandingComponent } from './first-time/landing/landing.component';
import { LoginComponent } from './first-time/login/login.component';
import { ConsentComponent } from './first-time/consent/consent.component';
import { EarlyAccessComponent } from './first-time/early-access/early-access.component';
import { OnboardingComponent } from './first-time/onboarding/onboarding.component';
import { HomeComponent } from './main/home/home.component';

export const routes: Routes = [
  // Admin Routes
  { path: 'admin', loadComponent: () => import('./admin/admin-panel/admin-panel.component')
    .then((mod) => mod.AdminPanelComponent), canActivate: [AuthGuard] },
  // First-Time User Experience Routes
  { path: 'landing', loadComponent: () => import('./first-time/landing/landing.component')
    .then((mod) => mod.LandingComponent), canActivate: [AuthGuard] },
  { path: 'login', loadComponent: () => import('./first-time/login/login.component')
    .then((mod) => mod.LoginComponent) },
  { path: 'consent', loadComponent: () => import('./first-time/consent/consent.component')
    .then((mod) => mod.ConsentComponent), canActivate: [AuthGuard] },
  { path: 'early-access', loadComponent: () => import('./first-time/early-access/early-access.component')
    .then((mod) => mod.EarlyAccessComponent), canActivate: [AuthGuard] },
  { path: 'onboarding', loadComponent: () => import('./first-time/onboarding/onboarding.component')
    .then((mod) => mod.OnboardingComponent), canActivate: [AuthGuard] },
  // Main Routes
  { path: 'home', loadComponent: () => import('./main/home/home.component')
    .then((mod) => mod.HomeComponent), canActivate: [AuthGuard] },
  { path: '', loadComponent: () => import('./first-time/landing/landing.component')
    .then((mod) => mod.LandingComponent), canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'landing', pathMatch: 'full' },
];
