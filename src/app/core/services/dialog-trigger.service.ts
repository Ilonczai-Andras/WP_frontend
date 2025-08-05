import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DialogTriggerService {
  private openprofileDialog = new Subject<void>();
  profileDialogtrigger$: Observable<void> = this.openprofileDialog.asObservable();

  profileDialog() {
    this.openprofileDialog.next();
  }
}
