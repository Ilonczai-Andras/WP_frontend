import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { UserDto } from '../../models/userDto';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule, ProfileDialogComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  username: string | null = '';
  userid: number = 0;
  ShowDialog: boolean = false;

  profile!: UserDto;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUserName();
    this.userid = this.authService.getUserId();

    this.getProfile();
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
