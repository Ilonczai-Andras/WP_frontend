import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ConversationBoardPostResponseDto } from '../../../../models/conversationBoardPostResponseDto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getFormattedDateFromNumberArray } from '../../../../../app/shared/utils/string-utils';
import { ProfileService } from '../../../../core/services/profile.service';
import { CreateConversationBoardPostRequestDto } from '../../../../models/createConversationBoardPostRequestDto';
import { ConversationService } from '../../../../core/services/conversation.service';
import { UserDto } from '../../../../models/userDto';
import { AuthService } from '../../../../core/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-conversation-post',
  imports: [CommonModule, FormsModule],
  templateUrl: './conversation-post.component.html',
  styleUrl: './conversation-post.component.css',
})
export class ConversationPostComponent implements OnInit, OnDestroy {
  @Input() post!: ConversationBoardPostResponseDto;
  showReplyBox = false;
  replyContent = '';
  postedAt: string | null = '';
  isOwnProfile = false;
  profile!: UserDto | null;
  profileId = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private profileService: ProfileService,
    private conversationService: ConversationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.postedAt = getFormattedDateFromNumberArray(this.post.postedAt);

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

  toggleReplyBox() {
    this.showReplyBox = !this.showReplyBox;
  }

  private getOwnerId(): number {
    return this.isOwnProfile ? this.profileId : this.authService.getUserId();
  }

  saveNewReply() {
    const newReply: CreateConversationBoardPostRequestDto = {
      ownerId: this.profileId,
      content: this.replyContent,
      parentPostId: this.post.id,
    };

    this.conversationService.savePost(this.getOwnerId(), newReply).subscribe({
      next: () => this.conversationService.refreshConversations(this.profileId),
      error: (err) => console.error(err),
      complete: () => {
        this.replyContent = '';
        this.showReplyBox = false;
      },
    });
  }
}
