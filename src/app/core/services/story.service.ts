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

  private storiesSubject = new BehaviorSubject<Array<StoryResponseDto> | null>(
    null
  );
  stories$: Observable<Array<StoryResponseDto> | null> =
    this.storiesSubject.asObservable();

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
    const requestWithDefaults = this.mergeWithDefaults(req);
    console.log(requestWithDefaults);

    const formData = new FormData();

    formData.append(
      'req',
      new Blob([JSON.stringify(requestWithDefaults)], {
        type: 'application/json',
      })
    );
    formData.append('file', file);

    return this.http.post<StoryResponseDto>(
      `${this.apiUrl}/${userId}/create`,
      formData
    );
  }

  getStories(userId: number): Observable<Array<StoryResponseDto>> {
    return this.http.get<Array<StoryResponseDto>>(
      `${this.apiUrl}/${userId}/stories`
    );
  }

  private mergeWithDefaults(req: Partial<StoryRequestDto>): StoryRequestDto {
    const merged: StoryRequestDto = { ...this.defaultStoryRequest };

    (Object.keys(req) as (keyof StoryRequestDto)[]).forEach((key) => {
      const value = req[key];

      const isNonEmptyString =
        typeof value === 'string' && value.trim().length > 0;
      const isNonEmptyArray = Array.isArray(value) && value.length > 0;
      const isBoolean = typeof value === 'boolean';
      const isEnum =
        (typeof value === 'string' && value.trim().length > 0) ||
        typeof value === 'number';

      if (
        value !== undefined &&
        value !== null &&
        (isNonEmptyString || isNonEmptyArray || isBoolean || isEnum)
      ) {
        merged[key] = value as any;
      }
    });

    return merged;
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

  setStories(stories: Array<StoryResponseDto>) {
    this.storiesSubject.next(stories);
  }

  getDefaultStoryReq(): StoryRequestDto {
    return this.defaultStoryRequest;
  }

  prefetchUserStories(userId: number): void {
    this.getStories(userId).subscribe((response) => {
      this.setStories(response);
    });
  }
}
