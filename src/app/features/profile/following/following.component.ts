import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Follower } from '../../../models/follower.model';
import { FollowerItemComponent } from './follower-item/follower-item.component';

@Component({
  selector: 'app-following',
  imports: [CommonModule, FollowerItemComponent ],
  templateUrl: './following.component.html',
  styleUrl: './following.component.css',
})
export class FollowingComponent {
  followers: Follower[] = [
    {
      id: 1,
      username: 'sarah_chen',
      displayName: 'Sarah Chen',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      isVerified: true,
    }
  ];

  getInitials(displayName: string): string {
    return displayName
      .split(' ')
      .map((name) => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
