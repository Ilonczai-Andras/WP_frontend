import { Injectable } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Observable, catchError, map } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { CredentialsDto } from '../../models/login.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'auth-token';
  private userSubject = new BehaviorSubject<any>(null);

  public loggedIn$: Observable<boolean> = this.userSubject
    .asObservable()
    .pipe(map((user) => !!user));

  constructor(private loginService: LoginService) {
    const token = this.getToken();
    if (token) {
      this.userSubject.next(this.decodeToken(token));
    }
  }

  login(credentials: CredentialsDto): Observable<any> {
    return this.loginService.login(credentials).pipe(
      map((response) => {
        const token = response.token;
        localStorage.setItem(this.tokenKey, token);
        this.userSubject.next(this.decodeToken(token));
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

  private isTokenExpired(token: string): boolean {
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
    return user.sub;
  }
}
