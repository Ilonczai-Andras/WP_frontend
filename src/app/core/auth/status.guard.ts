import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { StoryService } from '../services/story.service';
import { AuthService } from './auth.service';
import { StoryResponseDto } from '../../models/storyResponseDto';

export const StatusGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const storyService = inject(StoryService);
  const authService = inject(AuthService);
  const router = inject(Router);

  // Extract ID from combined route param
  const param = route.paramMap.get('storyIdAndTitle');
  const storyId = param ? Number(param.split('-')[0]) : 0;
  const loggedInUserId = authService.getUserId();

  if (!storyId || !loggedInUserId) {
    router.navigate(['/unauthorized']);
    return of(false);
  }

  return storyService.getStory(storyId).pipe(
    map((story) => {
      const isOwnProfile = story.authorId === loggedInUserId;

      const isPublished =
        story.status === StoryResponseDto.StatusEnum.Published;
      const isOwnDraft =
        isOwnProfile && story.status === StoryResponseDto.StatusEnum.Draft;

      if (isPublished || isOwnDraft) {
        return true;
      }

      router.navigate(['/unauthorized']);
      return false;
    }),
    catchError((err) => {
      router.navigate(['/unauthorized']);
      return of(false);
    })
  );
};
