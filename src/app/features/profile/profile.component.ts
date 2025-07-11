import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  username: string | null = '';
  userid: number = 0;
  works: number = 0;
  readingList: number = 0;
  followers: number = 0;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUserName();
    this.userid = this.authService.getUserId();

    this.profileService.getUserById(this.userid).subscribe(
      (response) => {},
      (error) => {}
    );
  }
}
