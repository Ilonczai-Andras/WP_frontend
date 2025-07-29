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
import { QuillModule } from 'ngx-quill';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-myworks-write',
  imports: [FormsModule, CommonModule, QuillModule],
  templateUrl: './myworks-write.component.html',
  styleUrl: './myworks-write.component.css',
})
export class MyworksWriteComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  storyId!: number;
  chapterId!: number;

  quill: any;

  story: StoryResponseDto = {};
  chapter: ChapterResponseDto = {};
  characterCount = 0;
  wordCount: number = 0;

  youtubeUrl: string = '';
  showYoutube: boolean = false;
  menuOpen: boolean = false;
  menuPosition = { x: 0, y: 0 };

  private contentChange$ = new Subject<string>();
  private autoSaveEnabled = true;
  private lastSavedContent = '';

  media: {
    type: 'image' | 'youtube' | null;
    src: string;
  } = { type: null, src: '' };

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.menuOpen) {
      const target = event.target as HTMLElement;
      if (
        !target.closest('.context-menu') &&
        !target.closest('.menu-trigger-button')
      ) {
        this.menuOpen = false;
      }
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    if (this.hasUnsavedChanges()) {
      event.preventDefault();
      event.returnValue =
        'You have unsaved changes. Are you sure you want to leave?';
      return event.returnValue;
    }
    return null;
  }

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private chapterService: ChapterService,
    private storyService: StoryService,
    private messageService: MessageService
  ) {
    this.contentChange$
      .pipe(debounceTime(2000), distinctUntilChanged())
      .subscribe((content) => {
        if (this.autoSaveEnabled && content !== this.lastSavedContent) {
          this.autoSave();
        }
      });
  }

  ngOnInit() {
    this.storyId = Number(this.route.snapshot.paramMap.get('storyId')!);
    this.chapterId = Number(this.route.snapshot.paramMap.get('chapterId')!);

    this.loadChapter();
    this.loadStory();
  }

  private loadChapter() {
    this.chapterService.getChapter(this.chapterId).subscribe((response) => {
      this.chapter = response;
      this.lastSavedContent = response.content || '';
    });
  }

  private loadStory() {
    this.storyService.getStory(this.storyId).subscribe((response) => {
      this.story = response;
    });
  }

  private hasUnsavedChanges(): boolean {
    return this.chapter.content !== this.lastSavedContent;
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  handleFileUpload(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image')) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

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
        this.youtubeUrl = '';
      } else {
        alert('Please enter a valid YouTube URL');
      }
    }
  }

  get sanitizedYoutubeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.media.src);
  }

  extractYoutubeId(url: string): string | null {
    const regExp =
      /(?:youtube\.com.*(?:\\?|&)v=|youtu\.be\/|youtube\.com.*embed\/)([^&#\?]*)/;
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

    const button = event.currentTarget as HTMLElement;
    const buttonRect = button.getBoundingClientRect();
    const container = button.closest('.media-section');
    const containerRect = container?.getBoundingClientRect();

    if (containerRect) {
      this.menuPosition = {
        x: buttonRect.left - containerRect.left - 160,
        y: buttonRect.top - containerRect.top,
      };
    }

    this.menuOpen = true;
  }

  private updateWordCount() {
    if (this.quill) {
      const text = this.quill.getText().trim();
      this.wordCount = text ? text.split(/\s+/).length : 0;
      this.characterCount = text.length;
    } else {
      this.wordCount = 0;
      this.characterCount = 0;
    }
  }

  //quill editor

  editorConfig = {
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ['clean'],
        ['link'],
      ],
    },
    placeholder: 'Start writing your chapter...',
    theme: 'snow',
  };

  editorStyle = {
    height: '400px',
    width: '100%',
    minHeight: '300px',
  };

  onContentChanged(event: any) {
    if (!this.quill) return;
    this.updateWordCount();
    if (this.chapter.content) {
      this.contentChange$.next(this.chapter.content);
    }
  }

  onSelectionChanged(event: any) {}

  onEditorCreated(quill: any) {
    this.quill = quill;

    quill.on('text-change', () => {
      this.updateWordCount();
      this.contentChange$.next(quill.root.innerHTML);
    });

    quill.keyboard.addBinding(
      {
        key: 'S',
        ctrlKey: true,
      },
      () => {
        this.saveChapter();
        return false;
      }
    );

    this.updateWordCount();
  }

  onContentChange() {
    this.updateWordCount();
    if (this.chapter.content) {
      this.contentChange$.next(this.chapter.content);
    }
  }

  previewChapter() {
    const previewUrl = `/preview/story/${this.storyId}/chapter/${this.chapterId}`;
    window.open(previewUrl, '_blank');
  }

  get isModified(): boolean {
    return this.hasUnsavedChanges();
  }

  //saving chapters
  saveChapter() {
    if (!this.chapter.content) {
      alert('Chapter content cannot be empty');
      return;
    }

    this.chapterService.updateChapter(this.chapterId, this.chapter).subscribe({
      next: (response) => {
        this.lastSavedContent = this.chapter.content || '';
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Chapter saved successfully!',
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Error saving chapter. Please try again.',
        });
      },
    });
  }

  private autoSave() {
    if (this.chapter.content && this.hasUnsavedChanges()) {
      this.chapterService
        .updateChapter(this.chapterId, this.chapter)
        .subscribe({
          next: (response) => {
            this.lastSavedContent = this.chapter.content || '';
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Auto-saved',
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Auto-save failed:', ${error}`,
            });
          },
        });
    }
  }

  publishChapter() {
    if (!this.chapter.content) {
      alert('Chapter content cannot be empty');
      return;
    }

    const publishedChapter = { ...this.chapter, status: 'Published' };

    this.chapterService
      .updateChapter(this.chapterId, publishedChapter)
      .subscribe({
        next: (response) => {
          this.chapter = response;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Chapter published successfully!',
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Error publishing chapter. Please try again.',
          });
        },
      });
  }
}
