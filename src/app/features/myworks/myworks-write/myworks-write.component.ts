import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  HostListener,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ChapterService } from '../../../core/services/chapter.service';
import { ChapterResponseDto } from '../../../models/chapterResponseDto';
import { StoryService } from '../../../core/services/story.service';
import { StoryResponseDto } from '../../../models/storyResponseDto';

@Component({
  selector: 'app-myworks-write',
  imports: [FormsModule, CommonModule],
  templateUrl: './myworks-write.component.html',
  styleUrl: './myworks-write.component.css',
})
export class MyworksWriteComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  storyId!: number;
  chapterId!: number;

  story: StoryResponseDto = {};
  chapter: ChapterResponseDto = {};
  wordCount: number = 0;

  youtubeUrl: string = '';
  showYoutube: boolean = false;
  menuOpen: boolean = false;
  menuPosition = { x: 0, y: 0 };

  media: {
    type: 'image' | 'youtube' | null;
    src: string;
  } = { type: null, src: '' };

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private chapterService: ChapterService,
    private storyService: StoryService
  ) {}

  ngOnInit() {
    this.storyId = Number(this.route.snapshot.paramMap.get('storyId')!);
    this.chapterId = Number(this.route.snapshot.paramMap.get('chapterId')!);

    this.chapterService.getChapter(this.chapterId).subscribe((response) => {
      this.chapter = response;
    });

    this.storyService.getStory(this.storyId).subscribe((response) => {
      this.story = response;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Close menu when clicking elsewhere
    if (this.menuOpen) {
      const target = event.target as HTMLElement;
      if (!target.closest('.menu') && !target.closest('.media-preview')) {
        this.menuOpen = false;
      }
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  handleFileUpload(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.media = { type: 'image', src: reader.result as string };
      };
      reader.readAsDataURL(file);
    }
  }

  showYoutubeInput(replace: boolean = false) {
    this.showYoutube = true;
    this.menuOpen = false;
    if (!replace) this.youtubeUrl = '';
  }

  cancelYoutube() {
    this.showYoutube = false;
    this.youtubeUrl = '';
  }

  addYoutube() {
    if (this.youtubeUrl.trim()) {
      const videoId = this.extractYoutubeId(this.youtubeUrl);
      if (videoId) {
        this.media = {
          type: 'youtube',
          src: `https://www.youtube.com/embed/${videoId}`,
        };
        this.showYoutube = false;
      }
    }
  }

  get sanitizedYoutubeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.media.src);
  }

  extractYoutubeId(url: string): string | null {
    const regExp = /(?:youtube\.com.*(?:\\?|&)v=|youtu\.be\/)([^&#]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }

  removeMedia() {
    this.media = { type: null, src: '' };
    this.menuOpen = false;
  }

  toggleMenu(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (this.menuOpen) {
      this.menuOpen = false;
      return;
    }

    // Position menu near the button that was clicked
    const button = event.currentTarget as HTMLElement;
    const buttonRect = button.getBoundingClientRect();
    const container = button.closest('.media-section');
    const containerRect = container?.getBoundingClientRect();

    if (containerRect) {
      // Position menu to the left of the button
      this.menuPosition = {
        x: buttonRect.left - containerRect.left - 160, // 160px is approximate menu width
        y: buttonRect.top - containerRect.top,
      };
    }

    this.menuOpen = true;
  }

  onContentChange() {
    if (this.chapter && this.chapter.content) {
      this.wordCount = this.chapter.content
        .split(/\s+/)
        .filter((w) => w).length;
    } else {
      this.wordCount = 0;
    }
  }
}
