import { Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { AboutComponent } from './about/about.component';
import { ConversationsComponent } from './conversations/conversations.component';
import { FollowingComponent } from './following/following.component';


export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      { path: '', redirectTo: 'about', pathMatch: 'full' },
      { path: 'about', component: AboutComponent },
      { path: 'conversations', component: ConversationsComponent },
      { path: 'following', component: FollowingComponent },
    ]
  }
];
