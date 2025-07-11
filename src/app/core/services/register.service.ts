import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SignUpDto } from '../../models/signUpDto';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = 'http://localhost:8080/api/register';

  constructor(private http: HttpClient) {}

  register(signUpData: SignUpDto): Observable<any> {
      return this.http.post(this.apiUrl, signUpData);
    }
}
