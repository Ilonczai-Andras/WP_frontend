import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FollowDto } from '../../models/followDto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private apiUrl = 'http://localhost:8080/api/users';

  // private followSubject = new BehaviorSubject<FollowDto | null>(null);
  // follow$: Observable<FollowDto | null> = this.followSubject.asObservable();

  constructor(private http: HttpClient) { }

  getFollowersById(userId: number):  Observable<FollowDto> {
    return this.http.get(`${this.apiUrl}/${userId}/followers`);
  }

  getFollowingById(userId: number):  Observable<FollowDto> {
    return this.http.get(`${this.apiUrl}/${userId}/following`);
  }
}
