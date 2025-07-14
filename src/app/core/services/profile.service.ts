import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { UserDto } from '../../models/userDto';
import { AboutDto } from '../../models/aboutDto';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'http://localhost:8080/api/user';

  private profileSubject = new BehaviorSubject<UserDto | null>(null);
  profile$: Observable<UserDto | null> = this.profileSubject.asObservable();

  private refreshTrigger = new BehaviorSubject<number | null>(null);

  constructor(private http: HttpClient) {
    this.refreshTrigger
      .pipe(
        switchMap((id) => {
          if (id === null) return [];
          return this.getUserById(id);
        })
      )
      .subscribe((profile) => {
        this.setProfile(profile);
      });
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateUserProfile(id: number, body: AboutDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/about/${id}`, body);
  }

  //ProfileStateService
  refreshUserProfile(id: number): void {
    this.refreshTrigger.next(id);
  }

  setProfile(profile: UserDto | null): void {
    this.profileSubject.next(profile);
  }

  getProfile(): UserDto | null {
    return this.profileSubject.getValue();
  }

  clearProfile(): void {
    this.profileSubject.next(null);
  }
}
