import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('user')!)
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Get current user value
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  // Login function
  login(username: string, password: string) {}

  // Logout function
  logout(): void {}

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }
}
