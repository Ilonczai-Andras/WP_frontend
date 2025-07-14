import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DialogTriggerService {
  private openTrigger = new Subject<void>();
  trigger$: Observable<void> = this.openTrigger.asObservable();

  triggerOpen() {
    this.openTrigger.next();
  }
}
