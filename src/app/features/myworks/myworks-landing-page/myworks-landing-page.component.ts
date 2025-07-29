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
import Swal from 'sweetalert2';

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
    if (
      !this.elementRef.nativeElement.contains(target) ||
      (!target.closest('.dropdown') && !target.closest('.continue-btn'))
    ) {
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

  deleteStory(story: StoryResponseDto) {
    Swal.fire({
      title: 'Warning: This cannot be undone.',
      html: `All reads for this story will be deleted.<br>
             All votes for this story will be deleted.<br>
             All comments for this story will be deleted.<br>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete my story',
      cancelButtonText: 'No, do not delete it',
      customClass: {
        confirmButton: 'custom-confirm-btn',
        cancelButton: 'custom-cancel-btn',
        popup: 'custom-popup',
        title: 'custom-title',
        htmlContainer: 'custom-text',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.storyService.deleteStory(story.id).subscribe(() => {
          Swal.fire({
            title: 'Your story has been deleted!',
            icon: 'success',
            confirmButtonText: 'Okay',
            customClass: {
              confirmButton: 'custom-confirm-btn-success',
              popup: 'custom-popup-success',
            },
            buttonsStyling: false,
          });
          this.storyService.refreshStories(this.profile?.id);
        });
      }
    });
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
