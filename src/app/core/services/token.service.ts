import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    return !decoded?.exp || Date.now() > decoded.exp * 1000;
  }

  decodeToken(token: string): any {
    if (!token) return null;

    const base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const pad = base64.length % 4;
    if (pad) base64 += '='.repeat(4 - pad);

    try {
      return JSON.parse(atob(base64));
    } catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  }
}
