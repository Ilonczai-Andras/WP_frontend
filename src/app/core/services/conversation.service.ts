import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { ConversationBoardPostResponseDto } from '../../models/conversationBoardPostResponseDto';
import { CreateConversationBoardPostRequestDto } from '../../models/createConversationBoardPostRequestDto';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  private apiUrl = 'http://localhost:8080/api/boards';

  private conversationSubject =
    new BehaviorSubject<Array<ConversationBoardPostResponseDto> | null>(null);
  conversation$: Observable<Array<ConversationBoardPostResponseDto> | null> =
    this.conversationSubject.asObservable();

  private refreshTrigger = new BehaviorSubject<number | null>(null);

  constructor(private http: HttpClient) {
    this.refreshTrigger
      .pipe(
        switchMap((id) => {
          if (id === null) return of(null);
          return this.getPostsForUser(id);
        })
      )
      .subscribe({
        next: (conversationDto) => this.setConversationData(conversationDto),
        error: (err) => console.error('Failed to fetch follow data:', err),
      });
  }

  getPostsForUser(
    userId: number
  ): Observable<Array<ConversationBoardPostResponseDto>> {
    return this.http.get<Array<ConversationBoardPostResponseDto>>(
      `${this.apiUrl}/${userId}/posts`
    );
  }

  savePost(
    userId: number,
    req: CreateConversationBoardPostRequestDto
  ): Observable<ConversationBoardPostResponseDto> {
    return this.http.post<ConversationBoardPostResponseDto>(
      `${this.apiUrl}/${userId}/posts`,
      req
    );
  }
  setConversationData(
    conversationDto: Array<ConversationBoardPostResponseDto> | null
  ): void {
    this.conversationSubject.next(conversationDto);
  }

  refreshConversations(id: number): void {
    this.refreshTrigger.next(id);
  }
}
