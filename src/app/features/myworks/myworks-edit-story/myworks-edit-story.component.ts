import { Component, OnInit } from '@angular/core';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { CommonModule, Location } from '@angular/common';
import { UserDto } from '../../../models/userDto';
import { ProfileService } from '../../../core/services/profile.service';
import { StoryResponseDto } from '../../../models/storyResponseDto';
import { StoryService } from '../../../core/services/story.service';
import { ActivatedRoute } from '@angular/router';
import { getFormattedDateFromNumberArray } from '../../../shared/utils/string-utils';
import { ChapterService } from '../../../core/services/chapter.service';
import { StoryFormComponent } from '../../../shared/story-form/story-form.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StoryRequestDto } from '../../../models/storyRequestDto';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-myworks-edit-story',
  imports: [LoadingSpinnerComponent, CommonModule, StoryFormComponent],
  templateUrl: './myworks-edit-story.component.html',
  styleUrl: './myworks-edit-story.component.css',
})
export class MyworksEditStoryComponent implements OnInit {
  activeTab: string = 'tableOfContents';

  isLoading: boolean = false;

  profile!: UserDto | null;

  file!: any;

  story: StoryResponseDto | null = {};
  coverImageUrl: string | ArrayBuffer | null = null;

  tagInputVisible = false;
  tagInput: string = '';

  storyForm: FormGroup;
  storyId: number = 0;
  storyRequest: StoryRequestDto = {};

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private storyService: StoryService,
    private chapterService: ChapterService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.storyForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      characters: this.fb.array([this.fb.control('')]),
      category: [
        StoryRequestDto.CategoryEnum.GeneralFiction,
        [Validators.required],
      ],
      tags: this.fb.array([]),
      targetAudience: [
        StoryRequestDto.TargetAudienceEnum.YoungAdult,
        [Validators.required],
      ],
      language: [StoryRequestDto.LanguageEnum.English, [Validators.required]],
      copyright: [
        StoryRequestDto.CopyrightEnum.AllRightsReserved,
        [Validators.required],
      ],
      mature: [false],
    });
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('storyIdAndTitle');
    this.storyId = param ? Number(param.split('-')[0]) : 0;

    this.storyForm.valueChanges.subscribe((value) => {
      this.setStoryManually();
    });

    this.profileService.profile$.subscribe((response) => {
      this.profile = response;
    });

    this.loadStory(this.storyId);
  }

  private loadStory(storyId: number | undefined) {
    this.storyService.getStory(storyId ?? 0).subscribe((response) => {
      this.story = response;

      this.storyForm.patchValue({
        title: this.story?.title || '',
        description: this.story?.description || '',
        category:
          this.story?.category || StoryRequestDto.CategoryEnum.GeneralFiction,
        targetAudience:
          this.story?.targetAudience ||
          StoryRequestDto.TargetAudienceEnum.YoungAdult,
        language: this.story?.language || StoryRequestDto.LanguageEnum.English,
        copyright:
          this.story?.copyright ||
          StoryRequestDto.CopyrightEnum.AllRightsReserved,
        mature: this.story?.mature || false,
      });

      this.setFormArray('characters', this.story?.mainCharacters || []);
      this.setFormArray('tags', this.story?.tags || []);
      if (this.story?.coverImageUrl) {
        this.coverImageUrl = this.story.coverImageUrl;
      }
    });
  }

  private setFormArray(controlName: string, values: any[]) {
    const formArray = this.storyForm.get(controlName) as FormArray;
    formArray.clear();

    values.forEach((value) => {
      formArray.push(this.fb.control(value));
    });
  }

  goBack(): void {
    this.location.back();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  createNewPart() {
    if (this.story?.chapters && this.story.chapters.length > 0) {
      const maxChapterId = Math.max(
        ...this.story?.chapters
          .map((chapter) => chapter.id)
          .filter((id) => id !== undefined)
      );
      this.chapterService
        .createNextChapter(maxChapterId)
        .subscribe((response) => {
          this.loadStory(this.storyId);
        });
    }
  }

  viewAsReader() {
    console.log('Opening reader view...');
  }

  getFormattedDate(input: any): string {
    return getFormattedDateFromNumberArray(input);
  }

  removeCharacter(index: number) {
    (this.storyForm.get('characters') as FormArray).removeAt(index);
  }

  addCharacter() {
    const charactersArray = this.storyForm.get('characters') as FormArray;
    charactersArray.push(this.fb.control(''));
  }

  removeTag(tagValue: string) {
    const tagsArray = this.storyForm.get('tags') as FormArray;
    const index = tagsArray.controls.findIndex(
      (control) => control.value === tagValue
    );

    if (index >= 0) {
      tagsArray.removeAt(index);
    }
  }

  onTagInput(event: KeyboardEvent) {
    if (event.key === ' ' && this.tagInput.trim() !== '') {
      this.addTagFromInput();
      event.preventDefault();
    }
  }

  addTagFromInput() {
    const trimmedTag = this.tagInput.trim();
    if (trimmedTag) {
      const tagsArray = this.storyForm.get('tags') as FormArray;
      const existingTag = tagsArray.controls.find(
        (control) => control.value === trimmedTag
      );

      if (!existingTag) {
        tagsArray.push(this.fb.control(trimmedTag));
      }
    }
    this.tagInput = '';
  }

  onCoverSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const MAX_SIZE_MB = 2;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`Image is too large. Max size is ${MAX_SIZE_MB}MB.`);
        return;
      }

      this.coverImageUrl = URL.createObjectURL(file);
      this.file = file;
    }
  }

  setStoryManually() {
    const formValue = this.storyForm.value;

    this.storyRequest = {
      title: formValue.title?.trim() ?? '',
      description: formValue.description?.trim() ?? '',
      mainCharacters: Array.isArray(formValue.characters)
        ? formValue.characters
            .filter(
              (char: string | null) =>
                typeof char === 'string' && char.trim() !== ''
            )
            .map((char: string) => char.trim())
        : [],
      category: formValue.category,
      tags: formValue.tags ?? [],
      targetAudience: formValue.targetAudience,
      language: formValue.language,
      copyright: formValue.copyright,
      mature: formValue.mature,
      coverImageUrl: this.coverImageUrl ? this.coverImageUrl.toString() : '',
    };
  }

  onUpdate() {
    this.storyService.updateStory(this.story?.id, this.storyRequest).subscribe(
      (response) => {
        this.loadStory(this.storyId);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Story saved successfully!',
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Story was not saved successfully!',
        });
      }
    );
  }
}
