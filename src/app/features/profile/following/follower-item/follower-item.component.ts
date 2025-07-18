import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FollowResponseDto } from '../../../../models/followResponseDto';
import { FollowService } from '../../../../core/services/follow.service';
import { ProfileService } from '../../../../core/services/profile.service';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-follower-item',
  imports: [CommonModule, RouterModule],
  templateUrl: './follower-item.component.html',
  styleUrl: './follower-item.component.css',
})
export class FollowerItemComponent {
  @Input() follower: FollowResponseDto | undefined = {};
  ownUserId: number = 0;
  otherUserId: number = 0;

  constructor(
    private followService: FollowService,
    private profileService: ProfileService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.profileService.profile$.subscribe((profile) => {
      if (profile?.id) {
        this.ownUserId = profile.id;
      }
    });
    if (this.follower?.id) {
      this.otherUserId = this.follower?.id;
    }
  }

  getInitials(firstName: string, lastName: string): string {
    if (!firstName && lastName) return '';
    return firstName[0] + ' ' + lastName[0];
  }

  unFollowUser() {
    this.followService.unfollowUser(this.ownUserId, this.otherUserId).subscribe(
      (response: string) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response,
        });
        this.followService.refreshFollowers(this.ownUserId)
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unfollow was not successful',
        });
      }
    );
  }
}
