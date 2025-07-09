import { Injectable } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Observable, map } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

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

  login(credentials: { userName: string; password: string }): Observable<any> {
    return this.loginService.login(credentials).pipe(
      map((response) => {
        const token = response.token;
        localStorage.setItem(this.tokenKey, token);
        this.userSubject.next(this.decodeToken(token));
        return response;
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
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    return !decoded?.exp || Date.now() > decoded.exp * 1000;
  }

  getUserId(): string | null {
    const user = this.getCurrentUser();
    return user ? user.sub : null;
  }
}
