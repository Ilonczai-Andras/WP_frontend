import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';
import { FollowDto } from '../../models/followDto';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class FollowService {
  private apiUrl = 'http://localhost:8080/api/users';

  private followSubject = new BehaviorSubject<FollowDto | null>(null);
  follow$: Observable<FollowDto | null> = this.followSubject.asObservable();

  private refreshTrigger = new BehaviorSubject<number | null>(null);

  constructor(private http: HttpClient) {
    this.refreshTrigger
      .pipe(
        switchMap((id) => {
          if (id === null) return of(null);
          return this.getFollowingById(id);
        })
      )
      .subscribe({
        next: (followDto) => this.setFollowData(followDto),
        error: (err) => console.error('Failed to fetch follow data:', err),
      });
  }

  getFollowersById(userId: number): Observable<FollowDto> {
    return this.http.get<FollowDto>(`${this.apiUrl}/${userId}/followers`);
  }

  getFollowingById(userId: number): Observable<FollowDto> {
    return this.http.get<FollowDto>(`${this.apiUrl}/${userId}/following`);
  }

  unfollowUser(followerId: number, followedId: number): Observable<string> {
    return this.http.delete(
      `${this.apiUrl}/${followerId}/unfollow/${followedId}`,
      {
        responseType: 'text',
      }
    );
  }

  followUser(followerId: number, followedId: number): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}/${followerId}/follow/${followedId}`,
      null,
      { responseType: 'text' as 'json' }
    );
  }

  prefetchOwnFollowing(userId: number): void {
    this.getFollowingById(userId).subscribe((response) => {
      this.setFollowData(response);
    });
  }

  checkIfUserFollows(targetUserId: number, ownUserId: number): Observable<boolean> {
    return this.getFollowingById(ownUserId).pipe(
      map((res) => res.following?.some((u) => u.id === targetUserId) || false)
    );
  }

  setFollowData(followDto: FollowDto | null): void {
    this.followSubject.next(followDto);
  }

  refreshFollowers(id: number): void {
    this.refreshTrigger.next(id);
  }
}
