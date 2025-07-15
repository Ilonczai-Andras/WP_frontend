import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../core/services/profile.service';
import { UserDto } from '../../../models/userDto';

@Component({
  selector: 'app-conversations',
  imports: [FormsModule],
  templateUrl: './conversations.component.html',
  styleUrl: './conversations.component.css',
})
export class ConversationsComponent implements OnInit {
  announceToFollowers: boolean = false;
  postContent: string = '';

  profile!: UserDto | null;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.profile$.subscribe((profile) => {
      this.profile = profile;
    });
  }

  onPost() {
    if (this.postContent.trim()) {
      console.log('Post content:', this.postContent);
      console.log('Announce to followers:', this.announceToFollowers);

      // Here you would typically send the post to your backend service
      // For now, we'll just clear the form
      this.postContent = '';
      this.announceToFollowers = false;
    }
  }

  onCheckboxChange(event: any) {
    this.announceToFollowers = event.target.checked;
  }
}
