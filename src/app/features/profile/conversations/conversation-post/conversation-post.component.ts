import { Component, Input } from '@angular/core';
import { ConversationBoardPostResponseDto } from '../../../../models/conversationBoardPostResponseDto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-conversation-post',
  imports: [CommonModule, FormsModule],
  templateUrl: './conversation-post.component.html',
  styleUrl: './conversation-post.component.css',
})
export class ConversationPostComponent {
  @Input() post!: ConversationBoardPostResponseDto;
  showReplyBox = false;
  replyContent = '';

  toggleReplyBox() {
    this.showReplyBox = !this.showReplyBox;
  }

  submitReply() {
    const newReply: ConversationBoardPostResponseDto = {
      content: this.replyContent,
      parentId: this.post.id,
      // Fill posterUsername/ownerUsername as needed
    };

    // Call your service to send the reply
    // this.conversationService.postReply(newReply).subscribe(...)
    this.replyContent = '';
    this.showReplyBox = false;
  }
}
