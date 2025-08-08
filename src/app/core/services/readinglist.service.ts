import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { ReadingListResponseDto } from '../../models/readingListResponseDto';
import { HttpClient } from '@angular/common/http';
import { ReadingListRequestDto } from '../../models/readingListRequestDto';
import { AddStoryToListRequestDto } from '../../models/addStoryToListRequestDto';
import { ReadingListItemResponseDto } from '../../models/readingListItemResponseDto';
import { ReadingListOrderUpdateDto } from '../../models/readingListOrderUpdateDto';

@Injectable({
  providedIn: 'root',
})
export class ReadinglistService {
  private apiUrl = 'http://localhost:8080/api/reading-lists';

  private readingListSubject =
    new BehaviorSubject<Array<ReadingListResponseDto> | null>(null);
  readingList$: Observable<Array<ReadingListResponseDto> | null> =
    this.readingListSubject.asObservable();

  private refreshTrigger = new BehaviorSubject<number | null>(null);

  constructor(private http: HttpClient) {
    this.refreshTrigger
      .pipe(
        switchMap((id) => {
          if (id === null) return of(null);
          return this.getUserLists(id);
        })
      )
      .subscribe({
        next: (readingListResponseDto) =>
          this.setReadingListData(readingListResponseDto),
        error: (err) =>
          console.error('Failed to fetch reading-list data:', err),
      });
  }

  getUserLists(userId: number): Observable<Array<ReadingListResponseDto>> {
    return this.http.get<Array<ReadingListResponseDto>>(
      `${this.apiUrl}/${userId}`
    );
  }

  getListItems(listId: number): Observable<Array<ReadingListItemResponseDto>> {
    return this.http.get<Array<ReadingListItemResponseDto>>(
      `${this.apiUrl}/${listId}/items`
    );
  }

  createList(
    ownerId: number | undefined,
    req: ReadingListRequestDto
  ): Observable<ReadingListResponseDto> {
    return this.http.post<ReadingListResponseDto>(
      `${this.apiUrl}/${ownerId}`,
      req
    );
  }

  addStory(req: AddStoryToListRequestDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add`, req);
  }

  deleteReadingList(readingListId: number | undefined): Observable<string> {
    return this.http.delete(`${this.apiUrl}/list/${readingListId}`, {
      responseType: 'text',
    });
  }

  deleteReadingListItem(
    readingListItemId: number | undefined
  ): Observable<string> {
    return this.http.delete(`${this.apiUrl}/item/${readingListItemId}`, {
      responseType: 'text',
    });
  }

  deleteAllReadingListItem(
    readingListId: number | undefined
  ): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete-all/${readingListId}`, {
      responseType: 'text',
    });
  }

  reorderReadingLists(
    userId: number | undefined,
    reorderedLists: ReadingListOrderUpdateDto[]
  ) {
    return this.http.post(
      `${this.apiUrl}/${userId}/reading-lists/reorder`,
      reorderedLists,
      {
        responseType: 'text',
      }
    );
  }

  prefetchOwnReadingLists(userId: number): void {
    this.getUserLists(userId).subscribe((response) => {
      this.setReadingListData(response);
    });
  }

  setReadingListData(
    readingListResponseDto: Array<ReadingListResponseDto> | null
  ): void {
    this.readingListSubject.next(readingListResponseDto);
  }

  refreshReadingLists(id: number | undefined): void {
    this.refreshTrigger.next(id ?? 0);
  }
}
