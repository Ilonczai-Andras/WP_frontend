import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { AuthGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./features/home/home.routes').then(m => m.HOME_ROUTES),
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'user',
    loadChildren: () => import('./features/profile/profile.routes').then(m => m.PROFILE_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'myworks',
    loadChildren: () => import('./features/myworks/myworks-landing-page/mywork-landing-pages.routes').then(m => m.MY_WORKS_LANDING_PAGE),
    canActivate: [AuthGuard]
  },
  {
    path: 'myworks/new',
    loadChildren: () => import('./features/myworks/myworks-new/mywork-new.routes').then(m => m.MY_WORKS_NEW),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
