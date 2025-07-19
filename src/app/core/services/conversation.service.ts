import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConversationBoardPostResponseDto } from '../../models/conversationBoardPostResponseDto';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  private apiUrl = 'http://localhost:8080/api/boards';
  constructor(private http: HttpClient) {}

  getPostsForUser(
    userId: number
  ): Observable<Array<ConversationBoardPostResponseDto>> {
    return this.http.get<Array<ConversationBoardPostResponseDto>>(
      `${this.apiUrl}/${userId}/posts`
    );
  }
}
