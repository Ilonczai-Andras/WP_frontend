import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { UserDto } from '../../models/userDto';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  username: string | null = '';
  userid: number = 0;
  joinedText: string | null = '';

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

        const joinedAt = this.profile.profile?.joinedAt;
        if (joinedAt && joinedAt.length >= 7) {
          const date = new Date(
            Number(joinedAt[0]),
            Number(joinedAt[1]) - 1,
            Number(joinedAt[2]),
            Number(joinedAt[3]),
            Number(joinedAt[4]),
            Number(joinedAt[5]),
            Math.floor(Number(joinedAt[6]) / 1e6)
          );

          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          };

          const formattedDate =
            'Joined ' + date.toLocaleDateString('en-US', options);
          this.joinedText = formattedDate;
        }
      },
      (error) => {
        console.error('Failed to load profile', error);
      }
    );
  }
}
