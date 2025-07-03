import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = 'http://localhost:8080/register';

  constructor(private http: HttpClient) {}

  register(input: any): Observable<any> {
      const body = {
        firstName: input.firstName,
        lastName: input.lastName,
        userName: input.userName,
        password: input.password
      };
      return this.http.post(this.apiUrl, body);
    }
}
