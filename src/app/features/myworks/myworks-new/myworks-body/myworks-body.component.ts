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
import {
  CategoryEnum,
  CategoryLabels,
} from '../../../../shared/enums/category.enum';
import {
  LanguageEnum,
  LanguageLabels,
} from '../../../../shared/enums/language.enum';
import {
  CopyrightLicenseEnum,
  CopyrightLicenseLabels,
} from '../../../../shared/enums/copyright-license.enum';
import {
  TargetAudienceEnum,
  TargetAudienceLabels,
} from '../../../../shared/enums/target-audience.enum';

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
  tagsList: string[] = [];

  categories = Object.values(CategoryEnum);
  categoryLabels = CategoryLabels;
  selectedCategory: CategoryEnum | null = null;

  languages = Object.values(LanguageEnum);
  languageLabels = LanguageLabels;
  selectedLanguage: LanguageEnum = LanguageEnum.ENGLISH;

  licenses = Object.values(CopyrightLicenseEnum);
  licenseLabels = CopyrightLicenseLabels;
  selectedLicense: CopyrightLicenseEnum =
    CopyrightLicenseEnum.ALL_RIGHTS_RESERVED;

  audiences = Object.values(TargetAudienceEnum);
  audienceLabels = TargetAudienceLabels;
  selectedAudience: TargetAudienceEnum = TargetAudienceEnum.YOUNG_ADULT;

  constructor(private fb: FormBuilder) {
    this.storyForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      characters: this.fb.array([this.fb.control('', Validators.required)]),
      category: ['', [Validators.required]],
      tags: this.fb.array([]),
      targetAudience: ['', [Validators.required]],
      language: ['', [Validators.required]],
      copyright: ['', [Validators.required]],
      mature: [false],
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
    this.characters.push(this.fb.control(''));
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
    if (trimmedTag && !this.tagsList.includes(trimmedTag)) {
      this.tagsList.push(trimmedTag);
      this.tags.push(this.fb.control(trimmedTag));
    }
    this.tagInput = '';
  }

  removeTag(tag: string) {
    const index = this.tagsList.indexOf(tag);
    if (index >= 0) {
      this.tagsList.splice(index, 1);
      (this.storyForm.get('tags') as FormArray).removeAt(index);
    }
  }
  areAllCharactersFilled(): boolean {
    return this.characters.some((char) => char.value.trim() === '');
  }

  onCoverSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.coverImageUrl = reader.result);
      reader.readAsDataURL(file);
    }
  }

  submit() {}
}
