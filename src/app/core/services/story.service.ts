import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StoryRequestDto } from '../../models/storyRequestDto';
import { StoryResponseDto } from '../../models/storyResponseDto';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  private apiUrl = 'http://localhost:8080/api/stories';

  private storySubject = new BehaviorSubject<StoryRequestDto | null>(null);
  story$: Observable<StoryRequestDto | null> = this.storySubject.asObservable();

  private fileSubject = new BehaviorSubject<any>(null);
  file$: Observable<any> = this.fileSubject.asObservable();

  defaultStoryRequest: StoryRequestDto = {
    title: '',
    description: '',
    mainCharacters: [],
    category: StoryRequestDto.CategoryEnum.GeneralFiction,
    tags: [],
    targetAudience: StoryRequestDto.TargetAudienceEnum.YoungAdult,
    language: StoryRequestDto.LanguageEnum.English,
    copyright: StoryRequestDto.CopyrightEnum.AllRightsReserved,
    mature: false,
    coverImageUrl: '',
  };

  constructor(private http: HttpClient) {}

  createStory(
    userId: number,
    req: StoryRequestDto,
    file: any
  ): Observable<StoryResponseDto> {
    const requestWithDefaults: StoryRequestDto = {
      ...this.defaultStoryRequest,
      ...req,
    };

    const formData = new FormData();

    formData.append(
      'req',
      new Blob([JSON.stringify(requestWithDefaults)], { type: 'application/json' })
    );
    formData.append('file', file);

    return this.http.post<StoryResponseDto>(
      `${this.apiUrl}/${userId}/create`,
      formData
    );
  }

  createStoryWithDefaultValues(userId: number): Observable<StoryResponseDto> {
    return this.http.post<StoryResponseDto>(
      `${this.apiUrl}/${userId}/create`,
      this.defaultStoryRequest
    );
  }

  isCompleteStory(req: StoryRequestDto): boolean {
    return (
      typeof req.title === 'string' &&
      req.title.trim().length > 0 &&
      typeof req.description === 'string' &&
      req.description.trim().length > 0 &&
      Array.isArray(req.mainCharacters) &&
      req.mainCharacters.length > 0 &&
      req.mainCharacters.every(
        (c) => typeof c === 'string' && c.trim().length > 0
      ) &&
      Array.isArray(req.tags) &&
      req.tags.length > 0 &&
      !!req.category &&
      !!req.language &&
      !!req.targetAudience &&
      !!req.copyright
    );
  }

  setStory(req: StoryRequestDto) {
    this.storySubject.next(req);
  }

  setFormData(input: any) {
    this.fileSubject.next(input);
  }
}
