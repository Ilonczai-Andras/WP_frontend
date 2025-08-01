import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChapterResponseDto } from '../../models/chapterResponseDto';
import { ChapterRequestDto } from '../../models/chapterRequestDto';

@Injectable({
  providedIn: 'root',
})
export class ChapterService {
  private apiUrl = 'http://localhost:8080/api/chapters';

  constructor(private http: HttpClient) {}

  getChapter(chapterId: number): Observable<ChapterResponseDto> {
    return this.http.get<ChapterResponseDto>(
      `${this.apiUrl}/${chapterId}/chapter`
    );
  }

  updateChapter(
    chapterId: number,
    updatedChapter: ChapterRequestDto
  ): Observable<ChapterResponseDto> {
    return this.http.put<ChapterResponseDto>(
      `${this.apiUrl}/update-chapter/${chapterId}`,
      updatedChapter
    );
  }

  updateChapterFormData(chapterId: number, formData: FormData): Observable<ChapterResponseDto>  {
  return this.http.put<ChapterResponseDto>(`${this.apiUrl}/${chapterId}`, formData);
}

  createNextChapter(chapterId: number): Observable<ChapterResponseDto> {
    return this.http.post<ChapterResponseDto>(
      `${this.apiUrl}/next-chapter/${chapterId}`,
      {}
    );
  }
}
