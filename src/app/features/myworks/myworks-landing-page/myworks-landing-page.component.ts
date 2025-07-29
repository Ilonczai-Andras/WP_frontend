import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { UserDto } from '../../../models/userDto';
import { ProfileService } from '../../../core/services/profile.service';
import { Subject, takeUntil } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { StoryService } from '../../../core/services/story.service';
import { StoryResponseDto } from '../../../models/storyResponseDto';
import { CommonModule } from '@angular/common';
import { getFormattedDateFromNumberArray } from '../../../../app/shared/utils/string-utils';
import { ChapterResponseDto } from '../../../models/chapterResponseDto';

@Component({
  selector: 'app-myworks-landing-page',
  imports: [RouterModule, CommonModule],
  templateUrl: './myworks-landing-page.component.html',
  styleUrl: './myworks-landing-page.component.css',
})
export class MyworksLandingPageComponent implements OnInit {
  profile!: UserDto | null;

  stories: Array<StoryResponseDto> | null = [];

  selectedStory: StoryResponseDto | null = null;
  chapterList: ChapterResponseDto[] = [];

  publishedStoryCount: number | undefined = 0;
  draftStoryCount: number | undefined = 0;

  private destroy$ = new Subject<void>();
  isMenuOpen: boolean = false;
  deleteMenuOpen: boolean = false;

  constructor(
    private profileService: ProfileService,
    private storyService: StoryService,
    private router: Router,
    private elementRef: ElementRef
  ) {}

  // Listen for clicks anywhere on the document
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;

    // Check if the click was outside the dropdown and continue button
    if (!this.elementRef.nativeElement.contains(target) ||
        (!target.closest('.dropdown') && !target.closest('.continue-btn'))) {

      // Only close if the click wasn't on a continue button
      if (!target.closest('.continue-btn')) {
        this.closeAllMenus();
      }
    }
  }

  ngOnInit(): void {
    this.profileService.profile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((profile) => {
        this.profile = profile;
      });

    this.storyService.stories$.subscribe((response) => {
      this.stories = response;

      this.publishedStoryCount = response?.filter(
        (story) => story.status === 'PUBLISHED'
      ).length;

      this.draftStoryCount = response?.filter(
        (story) => story.status === 'DRAFT'
      ).length;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onContinueWriting(story: StoryResponseDto) {
    // Close other menus first
    if (this.selectedStory !== story) {
      this.closeAllMenus();
    }

    this.selectedStory = story;
    // Toggle the menu to display chapters
    this.isMenuOpen = !this.isMenuOpen;
    this.deleteMenuOpen = false;
  }

  toggleMenu(story: any) {
    this.selectedStory = this.selectedStory === story ? null : story;
    this.isMenuOpen = false;
  }

  toggleDeleteMenu(story: any) {
    if (this.selectedStory === story) {
      this.deleteMenuOpen = !this.deleteMenuOpen;
    } else {
      this.selectedStory = story;
      this.deleteMenuOpen = true;
    }
    this.isMenuOpen = false;
  }

  onDeleteStory(story: StoryResponseDto) {
    this.storyService.deleteStory(story.id).subscribe(() => {
      this.storyService.refreshStories(this.profile?.id)
    })
  }

  getFormattedDate(input: any): string {
    return getFormattedDateFromNumberArray(input);
  }

  // Helper method to close all menus - now public since template calls it
  closeAllMenus(): void {
    this.isMenuOpen = false;
    this.deleteMenuOpen = false;
    this.selectedStory = null;
  }
}
