import { Component } from '@angular/core';
import { UserDto } from '../../../../models/userDto';
import { ProfileService } from '../../../../core/services/profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConversationService } from '../../../../core/services/conversation.service';
import { CreateConversationBoardPostRequestDto } from '../../../../models/createConversationBoardPostRequestDto';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-create-conversation',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-conversation.component.html',
  styleUrls: ['./create-conversation.component.css'],
})
export class CreateConversationComponent {
  announceToFollowers: boolean = false;
  postContent: string = '';

  isOwnProfile = false;

  profile!: UserDto | null;
  profileId: number = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private profileService: ProfileService,
    private conversationService: ConversationService
  ) {}

  ngOnInit(): void {
    this.profileService.profile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((profile) => {
        this.profile = profile;
        this.profileId = profile?.id ?? 0;
      });

    this.profileService.isOwnProfile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isOwn) => {
        this.isOwnProfile = isOwn;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveNewPost(): void {
    const newPost: CreateConversationBoardPostRequestDto = {
      ownerId: this.profileId,
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

  onCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.announceToFollowers = target.checked;
  }
}
