import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { UserDto } from '../../models/userDto';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { DialogTriggerService } from '../../core/services/dialog-trigger.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule, ProfileDialogComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, OnDestroy {
  username: string | null = '';
  userid: number = 0;
  ShowDialog: boolean = false;

  profile!: UserDto;

  private destroy$ = new Subject<void>();

  private openTrigger = new BehaviorSubject<boolean | null>(false);

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private dialogTriggerService: DialogTriggerService
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUserName();
    this.userid = this.authService.getUserId();

    this.dialogTriggerService.trigger$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.openProfileDialog();
      });

    this.getProfile();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getProfile() {
    this.profileService.getUserById(this.userid).subscribe(
      (response) => {
        this.profile = response;
        this.profileService.setProfile(this.profile);
      },
      (error) => {
        console.error('Failed to load profile', error);
      }
    );
  }
  openProfileDialog() {
    this.ShowDialog = true;
  }
}
