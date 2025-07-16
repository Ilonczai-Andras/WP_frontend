import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../core/services/profile.service';
import { UserDto } from '../../../models/userDto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conversations',
  imports: [FormsModule, CommonModule],
  templateUrl: './conversations.component.html',
  styleUrl: './conversations.component.css',
})
export class ConversationsComponent implements OnInit {
  announceToFollowers: boolean = false;
  postContent: string = '';

  isOwnProfile = false;

  profile!: UserDto | null;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.profile$.subscribe((profile) => {
      this.profile = profile;
    });

    this.profileService.isOwnProfile$.subscribe((isOwn) => {
      this.isOwnProfile = isOwn;
    });
  }

  onPost(): void {
    // post logic
    console.log('Posting:', this.postContent);
  }

  onCheckboxChange(event: any) {
    this.announceToFollowers = event.target.checked;
  }
}
