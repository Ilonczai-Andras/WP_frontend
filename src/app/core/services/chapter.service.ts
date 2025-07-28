import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChapterResponseDto } from '../../models/chapterResponseDto';

@Injectable({
  providedIn: 'root',
})
export class ChapterService {
  private apiUrl = 'http://localhost:8080/api/chapters';

  constructor(private http: HttpClient) {}

  getChapter(chapterId: number): Observable<ChapterResponseDto> {
    return this.http.get<ChapterResponseDto>(`${this.apiUrl}/${chapterId}/chapter`);
  }
}
