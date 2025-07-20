import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConversationPostComponent } from '../conversation-post/conversation-post.component';
import { ConversationBoardPostResponseDto } from '../../../../models/conversationBoardPostResponseDto';
import { ConversationService } from '../../../../core/services/conversation.service';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-show-conversation',
  imports: [ConversationPostComponent, CommonModule],
  templateUrl: './show-conversation.component.html',
  styleUrls: ['./show-conversation.component.css'],
})
export class ShowConversationComponent implements OnInit, OnDestroy {
  posts: Array<ConversationBoardPostResponseDto> = [];
  private destroy$ = new Subject<void>();

  constructor(private conversationService: ConversationService) {}

  private loadPosts(): void {
    this.conversationService.conversation$
      .pipe(takeUntil(this.destroy$))
      .subscribe((posts) => {
        this.posts = posts || [];
      });
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
