import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'signup', loadComponent: () => import('./components/signup/signup.component').then((c) => c.SignupComponent) },
    { path: 'login', loadComponent: () => import('./components/login/login.component').then((c) => c.LoginComponent) },
    { path: 'user-management', loadComponent: () => import('./components/user-management/user-management.component').then((c) => c.UserManagementComponent) },
    { path: '**', redirectTo: 'login' }
];
