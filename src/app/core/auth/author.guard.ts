import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { StoryService } from '../services/story.service';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const AuthorGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const storyService = inject(StoryService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const storyId = Number(route.paramMap.get('storyId'));
  const loggedInUserId = authService.getUserId();
  console.log(storyId, loggedInUserId);

  if (!storyId || !loggedInUserId) {
    router.navigate(['/unauthorized']);
    return of(false);
  }

  return storyService.getStory(storyId).pipe(
    map((story) => {
      const isAuthor = story.authorId === loggedInUserId;
      if (!isAuthor) {
        router.navigate(['/unauthorized']);
      }
      return isAuthor;
    }),
    catchError((err) => {
      router.navigate(['/unauthorized']);
      return of(false);
    })
  );
};
