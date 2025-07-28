import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { AuthGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
    data: { showHeader: true },
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { showHeader: true },
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { showHeader: true },
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./features/profile/profile.routes').then((m) => m.PROFILE_ROUTES),
    canActivate: [AuthGuard],
    data: { showHeader: true },
  },
  {
    path: 'myworks',
    loadChildren: () =>
      import(
        './features/myworks/myworks-landing-page/mywork-landing-pages.routes'
      ).then((m) => m.MY_WORKS_LANDING_PAGE),
    canActivate: [AuthGuard],
    data: { showHeader: true },
  },
  {
    path: 'myworks/new',
    loadChildren: () =>
      import('./features/myworks/myworks-new/mywork-new.routes').then(
        (m) => m.MY_WORKS_NEW
      ),
    canActivate: [AuthGuard],
    data: { showHeader: true },
  },
  {
    path: 'myworks/:storyId/write/:chapterId',
    loadChildren: () =>
      import('./features/myworks/myworks-write/mywork-write.routes').then(
        (m) => m.MY_WORKS_WRITE
      ),
    canActivate: [AuthGuard],
    data: { showHeader: true },
  },
  {
    path: 'story/:storyIdAndTitle',
    loadChildren: () =>
      import('./features/story/story-overview/story-overview.routes').then(
        (m) => m.STORY_OVERVIEW_ROUTES
      ),
    canActivate: [AuthGuard],
    data: { showHeader: true },
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
