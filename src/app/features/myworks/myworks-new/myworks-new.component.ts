import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { RouterModule } from '@angular/router';
import { LayoutService } from '../../../core/services/layout.service';
import { CommonModule, Location } from '@angular/common';
import { ProfileService } from '../../../core/services/profile.service';
import { UserDto } from '../../../models/userDto';
import { StoryRequestDto } from '../../../models/storyRequestDto';
import { StoryService } from '../../../core/services/story.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryLabels } from '../../../shared/enums/category.enum';
import { LanguageLabels } from '../../../shared/enums/language.enum';
import { CopyrightLicenseLabels } from '../../../shared/enums/copyright-license.enum';
import { TargetAudienceLabels } from '../../../shared/enums/target-audience.enum';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-myworks-new-page',
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './myworks-new.component.html',
  styleUrl: './myworks-new.component.css',
})
export class MyworksNewComponent implements OnInit {
  private destroy$ = new Subject<void>();

  profile!: UserDto | null;

  storyRequest: StoryRequestDto = {};

  file!: any;

  storyForm: FormGroup;
  coverImageUrl: string | ArrayBuffer | null = null;

  tagInputVisible = false;
  tagInput: string = '';

  categories = Object.values(StoryRequestDto.CategoryEnum);
  categoryLabels = CategoryLabels;

  languages = Object.values(StoryRequestDto.LanguageEnum);
  languageLabels = LanguageLabels;

  licenses = Object.values(StoryRequestDto.CopyrightEnum);
  licenseLabels = CopyrightLicenseLabels;

  audiences = Object.values(StoryRequestDto.TargetAudienceEnum);
  audienceLabels = TargetAudienceLabels;

  isLoading: boolean = false;

  constructor(
    private layoutService: LayoutService,
    private profileService: ProfileService,
    private storyService: StoryService,
    private fb: FormBuilder,
    private location: Location
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
    this.storyForm.valueChanges.subscribe((value) => {
      this.setStoryManually();
    });

    this.layoutService.setHeader(false);

    this.profileService.profile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((profile) => {
        this.profile = profile;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit() {
    this.isLoading = true;
    if (this.profile?.id)
      this.storyService
        .createStory(this.profile.id, this.storyRequest, this.file)
        .subscribe({
          next: () => {
            console.log('Story submitted');
            this.storyForm.reset(this.storyService.getDefaultStoryReq());
            this.coverImageUrl = '';
          },
          error: (err) => console.error(err),
          complete: () => {
            this.isLoading = false;
          },
        });
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

  removeCharacter(index: number) {
    (this.storyForm.get('characters') as FormArray).removeAt(index);
  }

  addCharacter() {
    const charactersArray = this.storyForm.get('characters') as FormArray;
    charactersArray.push(this.fb.control(''));
  }

  hasEmptyCharacter(): boolean {
    return this.characters.some((char) => {
      const value = char.value;
      return !value || (typeof value === 'string' && value.trim() === '');
    });
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

  get isComplete(): boolean {
    return (
      !!this.storyRequest &&
      this.storyService.isCompleteStory(this.storyRequest)
    );
  }

  get characters(): FormControl[] {
    return (this.storyForm.get('characters') as FormArray)
      .controls as FormControl[];
  }

  get tags(): FormControl[] {
    return (this.storyForm.get('tags') as FormArray).controls as FormControl[];
  }

  addTagFromInput() {
    const trimmedTag = this.tagInput.trim();
    if (trimmedTag) {
      // Check if tag already exists in the FormArray
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
}
