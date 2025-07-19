import { Component } from '@angular/core';
import { UserDto } from '../../../../models/userDto';
import { ProfileService } from '../../../../core/services/profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-conversation',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-conversation.component.html',
  styleUrl: './create-conversation.component.css',
})
export class CreateConversationComponent {
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
