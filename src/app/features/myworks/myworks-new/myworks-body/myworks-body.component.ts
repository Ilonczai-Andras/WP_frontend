import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryLabels } from '../../../../shared/enums/category.enum';
import { LanguageLabels } from '../../../../shared/enums/language.enum';
import { CopyrightLicenseLabels } from '../../../../shared/enums/copyright-license.enum';
import { TargetAudienceLabels } from '../../../../shared/enums/target-audience.enum';
import { StoryRequestDto } from '../../../../models/storyRequestDto';
import { StoryService } from '../../../../core/services/story.service';

@Component({
  selector: 'app-myworks-body',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './myworks-body.component.html',
  styleUrl: './myworks-body.component.css',
})
export class MyworksBodyComponent {
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

  constructor(private fb: FormBuilder, private storyService: StoryService) {
    this.storyForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      characters: this.fb.array([this.fb.control('')]),
      category: ['', [Validators.required]],
      tags: this.fb.array([]),
      targetAudience: ['', [Validators.required]],
      language: ['', [Validators.required]],
      copyright: ['', [Validators.required]],
      mature: [false],
    });
  }

  ngOnInit(): void {
    this.storyForm.valueChanges.subscribe((value) => {
      this.setStoryManually();
    });
  }

  get characters(): FormControl[] {
    return (this.storyForm.get('characters') as FormArray)
      .controls as FormControl[];
  }

  get tags(): FormControl[] {
    return (this.storyForm.get('tags') as FormArray).controls as FormControl[];
  }

  addCharacter() {
    const charactersArray = this.storyForm.get('characters') as FormArray;
    charactersArray.push(this.fb.control(''));
  }

  removeCharacter(index: number) {
    (this.storyForm.get('characters') as FormArray).removeAt(index);
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

  removeTag(tagValue: string) {
    const tagsArray = this.storyForm.get('tags') as FormArray;
    const index = tagsArray.controls.findIndex(
      (control) => control.value === tagValue
    );

    if (index >= 0) {
      tagsArray.removeAt(index);
    }
  }

  areAllCharactersFilled(): boolean {
    return this.characters.every((char) => char.value.trim() !== '');
  }

  hasEmptyCharacter(): boolean {
    return this.characters.some((char) => char.value.trim() === '');
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
      this.storyService.setFormData(file);
    }
  }

  setStoryManually() {
    const storyRequest: StoryRequestDto = {
      title: this.storyForm.value.title.trim(),
      description: this.storyForm.value.description.trim(),
      mainCharacters: this.storyForm.value.characters.filter(
        (char: string) => char.trim() !== ''
      ),
      category: this.storyForm.value.category,
      tags: this.storyForm.value.tags,
      targetAudience: this.storyForm.value.targetAudience,
      language: this.storyForm.value.language,
      copyright: this.storyForm.value.copyright,
      mature: this.storyForm.value.mature,
      coverImageUrl: this.coverImageUrl ? this.coverImageUrl.toString() : '',
    };

    this.storyService.setStory(storyRequest);
  }
}
