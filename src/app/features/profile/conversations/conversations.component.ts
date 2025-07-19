import { Component } from '@angular/core';
import { CreateConversationComponent } from './create-conversation/create-conversation.component';
import { ShowConversationComponent } from './show-conversation/show-conversation.component';

@Component({
  selector: 'app-conversations',
  imports: [CreateConversationComponent, ShowConversationComponent],
  templateUrl: './conversations.component.html',
  styleUrl: './conversations.component.css',
})
export class ConversationsComponent {

}
