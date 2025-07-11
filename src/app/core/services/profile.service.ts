import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDto } from '../../models/userDto';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'http://localhost:8080/api/user';

  private profileSubject = new BehaviorSubject<UserDto | null>(null);
  profile$: Observable<UserDto | null> = this.profileSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  //ProfileStateService
  setProfile(profile: UserDto): void {
    this.profileSubject.next(profile);
  }

  getProfile(): UserDto | null {
    return this.profileSubject.getValue();
  }

  clearProfile(): void {
    this.profileSubject.next(null);
  }
}
