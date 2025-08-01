import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { ReadingListResponseDto } from '../../models/readingListResponseDto';
import { HttpClient } from '@angular/common/http';

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
          this.setFollowData(readingListResponseDto),
        error: (err) =>
          console.error('Failed to fetch reading-list data:', err),
      });
  }

  getUserLists(userId: number): Observable<Array<ReadingListResponseDto>> {
    return this.http.get<Array<ReadingListResponseDto>>(
      `${this.apiUrl}/${userId}`
    );
  }

  prefetchOwnReadingLists(userId: number): void {
    this.getUserLists(userId).subscribe((response) => {
      this.setFollowData(response);
    });
  }

  setFollowData(
    readingListResponseDto: Array<ReadingListResponseDto> | null
  ): void {
    this.readingListSubject.next(readingListResponseDto);
  }

  refreshFollowers(id: number): void {
    this.refreshTrigger.next(id);
  }
}
