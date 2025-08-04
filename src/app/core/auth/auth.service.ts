import { Injectable } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Observable, catchError, map } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { CredentialsDto } from '../../models/credentialsDto';
import { ProfileService } from '../services/profile.service';
import { FollowService } from '../services/follow.service';
import { ConversationService } from '../services/conversation.service';
import { StoryService } from '../services/story.service';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { ReadinglistService } from '../services/readinglist.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'auth-token';
  private userSubject = new BehaviorSubject<any>(null);

  private countdownSubject = new BehaviorSubject<number | null>(null);
  public countdown$ = this.countdownSubject.asObservable();

  private tokenExpirationTimeout: any;
  private countdownInterval: any;

  public currentUser$ = this.userSubject.asObservable();

  public loggedIn$: Observable<boolean> = this.userSubject
    .asObservable()
    .pipe(map((user) => !!user));

  constructor(
    private loginService: LoginService,
    private profileService: ProfileService,
    private followService: FollowService,
    private conversationService: ConversationService,
    private storyService: StoryService,
    private tokenService: TokenService,
    private readinglistService: ReadinglistService,
    private router: Router
  ) {
    const token = this.getToken();
    if (token && !this.tokenService.isTokenExpired(token)) {
      const decodedUser = this.decodeToken(token);
      this.userSubject.next(decodedUser);
      this.scheduleTokenExpiryLogout(decodedUser.exp);

      if (decodedUser && decodedUser.userName && decodedUser.sub) {
        this.profileService.loadOwnProfile(decodedUser.userName);
        this.followService.prefetchOwnFollowing(decodedUser.sub);
        this.conversationService.prefetchUserPosts(decodedUser.sub);
        this.storyService.prefetchUserStories(decodedUser.sub);
        this.readinglistService.prefetchOwnReadingLists(decodedUser.sub);
      }
    }
  }

  login(credentials: CredentialsDto): Observable<any> {
    return this.loginService.login(credentials).pipe(
      map((response) => {
        const token = response.token;
        localStorage.setItem(this.tokenKey, token);
        if (token) {
          const decodedUser = this.decodeToken(token);
          this.userSubject.next(decodedUser);
          this.scheduleTokenExpiryLogout(decodedUser.exp);
          this.profileService.loadOwnProfile(decodedUser.userName);
          this.followService.prefetchOwnFollowing(decodedUser.sub);
          this.conversationService.prefetchUserPosts(decodedUser.sub);
          this.storyService.prefetchUserStories(decodedUser.sub);
          this.storyService.prefetchUserStories(decodedUser.sub);
          this.readinglistService.prefetchOwnReadingLists(decodedUser.sub);
        }

        return response;
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        throw error;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
    this.profileService.clearProfile();
    this.followService.setFollowData(null);
    this.conversationService.setConversationData(null);
    this.readinglistService.setReadingListData(null);
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    if (this.tokenExpirationTimeout) clearTimeout(this.tokenExpirationTimeout);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const expired = !token || this.isTokenExpired(token);

    if (expired) {
      this.logout();
    }

    return !expired;
  }

  getCurrentUser(): any {
    return this.userSubject.value;
  }

  private decodeToken(token: string): any {
    if (!token) {
      return null;
    }

    const base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const pad = base64.length % 4;
    if (pad) {
      base64 += '='.repeat(4 - pad);
    }

    try {
      return JSON.parse(atob(base64));
    } catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  }

  public isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    return !decoded?.exp || Date.now() > decoded.exp * 1000;
  }

  getUserName(): string | null {
    const user = this.getCurrentUser();
    return user ? user.userName : null;
  }

  getUserId(): number {
    const user = this.getCurrentUser();
    if (!user) {
      console.warn('User not found');
      return -1;
    }
    return Number(user.sub);
  }

  private scheduleTokenExpiryLogout(exp: number) {
    const expiresInMs = exp * 1000 - Date.now();

    if (this.tokenExpirationTimeout) clearTimeout(this.tokenExpirationTimeout);
    if (this.countdownInterval) clearInterval(this.countdownInterval);

    if (expiresInMs > 0) {
      this.countdownSubject.next(Math.floor(expiresInMs / 1000));
      this.countdownInterval = setInterval(() => {
        const current = this.countdownSubject.value;
        if (current !== null && current > 0) {
          this.countdownSubject.next(current - 1);
        }
      }, 1000);

      this.tokenExpirationTimeout = setTimeout(() => {
        this.logout();
        alert('Session expired. Please login again.');
        this.router.navigate(['/login']);
      }, expiresInMs);
    }
  }
}
