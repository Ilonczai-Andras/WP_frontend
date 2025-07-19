import { Component, OnInit } from '@angular/core';
import { ConversationPostComponent } from '../conversation-post/conversation-post.component';
import { ConversationBoardPostResponseDto } from '../../../../models/conversationBoardPostResponseDto';
import { ConversationService } from '../../../../core/services/conversation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-show-conversation',
  imports: [ConversationPostComponent, CommonModule],
  templateUrl: './show-conversation.component.html',
  styleUrl: './show-conversation.component.css',
})
export class ShowConversationComponent implements OnInit {
  posts: Array<ConversationBoardPostResponseDto> = [];

  constructor(private conversationService: ConversationService) {}

  ngOnInit(): void {
    this.conversationService.getPostsForUser(5).subscribe((data) => {
      this.posts = data;
    });
  }
}
