import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:8080/login';

  constructor(private http: HttpClient) {}

  login(input: any): Observable<any> {
    const body = { userName: input.userName, password: input.password };
    return this.http.post(this.apiUrl, body);
  }
}

