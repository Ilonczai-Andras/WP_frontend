import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';

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
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
