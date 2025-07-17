import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FollowerDto } from '../../../models/followerDto';
import { FollowerItemComponent } from './follower-item/follower-item.component';
import { FollowResponseDto } from '../../../models/followResponseDto';
import { FollowService } from '../../../core/services/follow.service';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-following',
  imports: [CommonModule, FollowerItemComponent],
  templateUrl: './following.component.html',
  styleUrl: './following.component.css',
})
export class FollowingComponent {
  followers: Array<FollowResponseDto> | undefined = [];
  userId: number | undefined = 0;
  userName: String | undefined = '';

  isOwnProfile = false;

  constructor(
    private followService: FollowService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.profileService.profile$.subscribe((profile) => {
      if (profile?.id && profile.userName) {
        this.userId = profile.id;
        this.userName = profile.userName;
      }
    });

    this.followService.follow$.subscribe((follow) => {
      this.followers = follow?.following
    })
  }
}
