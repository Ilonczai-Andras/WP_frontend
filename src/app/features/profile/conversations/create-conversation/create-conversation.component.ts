import { Component } from '@angular/core';
import { UserDto } from '../../../../models/userDto';
import { ProfileService } from '../../../../core/services/profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConversationService } from '../../../../core/services/conversation.service';
import { CreateConversationBoardPostRequestDto } from '../../../../models/createConversationBoardPostRequestDto';

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
  profileId: number = 0;

  constructor(
    private profileService: ProfileService,
    private conversationService: ConversationService
  ) {}

  ngOnInit(): void {
    this.profileService.profile$.subscribe((profile) => {
      this.profile = profile;
      if (profile) {
        this.profileId = profile.id ?? 0;
      }
    });

    this.profileService.isOwnProfile$.subscribe((isOwn) => {
      this.isOwnProfile = isOwn;
    });
  }

  saveNewPost(): void {
    const newPost: CreateConversationBoardPostRequestDto = {
      ownerId: this.profile?.id,
      content: this.postContent,
      parentPostId: null,
    };

    this.conversationService.savePost(this.profileId, newPost).subscribe(
      () => {
        this.conversationService.refreshConversations(this.profileId);
        this.postContent = '';
      },
      (error) => {
        this.postContent = '';
      }
    );
  }

  onCheckboxChange(event: any) {
    this.announceToFollowers = event.target.checked;
  }
}
