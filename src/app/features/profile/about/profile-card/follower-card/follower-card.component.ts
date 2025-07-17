import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FollowResponseDto } from '../../../../../models/followResponseDto';
import { FollowService } from '../../../../../core/services/follow.service';
import { ProfileService } from '../../../../../core/services/profile.service';

@Component({
  selector: 'app-follower-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './follower-card.component.html',
  styleUrl: './follower-card.component.css',
})
export class FollowerCardComponent {
  followers: Array<FollowResponseDto> | undefined = [];
  userId: number | undefined = 0;
  userName: String | undefined = '';
  isOwnProfile = false;
  @Input() maxVisible: number = 10;

  constructor(
    private profileService: ProfileService,
    private followerService: FollowService
  ) {}

  ngOnInit(): void {
    this.profileService.profile$.subscribe((profile) => {
      if (profile?.id && profile.userName) {
        this.userId = profile.id;
        this.userName = profile.userName;
      }
    });

    this.profileService.isOwnProfile$.subscribe((isOwn) => {
      this.isOwnProfile = isOwn;
    });

    this.followerService.follow$.subscribe((follow) => {
      this.followers = follow?.following
    });
  }

  get extraCount(): number {
    return (this.followers?.length ?? 0) - (this.maxVisible - 1);
  }

  get hasExtra(): boolean {
    return (this.followers?.length ?? 0) > this.maxVisible - 1;
  }
}
