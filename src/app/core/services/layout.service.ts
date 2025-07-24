import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private headerSubject = new BehaviorSubject<boolean>(true);
  header$: Observable<boolean> = this.headerSubject.asObservable();

  setHeader(headerShown: boolean) {
    this.headerSubject.next(headerShown);
  }
}
