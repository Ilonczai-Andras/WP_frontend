import {
  Component,
  EventEmitter,
  Input,
  Output,
  Signal,
  WritableSignal,
  effect,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StoryRequestDto } from '../../models/storyRequestDto';
import { CategoryLabels } from '../enums/category.enum';
import { LanguageLabels } from '../enums/language.enum';
import { CopyrightLicenseLabels } from '../enums/copyright-license.enum';
import { TargetAudienceLabels } from '../enums/target-audience.enum';

@Component({
  selector: 'app-story-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './story-form.component.html',
  styleUrls: ['./story-form.component.css'],
})
export class StoryFormComponent {
  @Input() storyForm!: FormGroup;
  @Input() coverImageUrl: string | ArrayBuffer | null = null;

  @Input() tagInput: string = '';
  @Input() tagInputVisible = false;

  @Output() tagInputChange = new EventEmitter<string>();
  @Output() removeCharacter = new EventEmitter<number>();
  @Output() addCharacter = new EventEmitter<void>();
  @Output() removeTag = new EventEmitter<string>();
  @Output() tagKeydown = new EventEmitter<KeyboardEvent>();
  @Output() coverSelected = new EventEmitter<Event>();

  file!: any;

  categories = Object.values(StoryRequestDto.CategoryEnum);
  categoryLabels = CategoryLabels;

  languages = Object.values(StoryRequestDto.LanguageEnum);
  languageLabels = LanguageLabels;

  licenses = Object.values(StoryRequestDto.CopyrightEnum);
  licenseLabels = CopyrightLicenseLabels;

  audiences = Object.values(StoryRequestDto.TargetAudienceEnum);
  audienceLabels = TargetAudienceLabels;

  get characters(): FormControl[] {
    return (this.storyForm.get('characters') as FormArray)
      .controls as FormControl[];
  }

  get tags(): FormControl[] {
    return (this.storyForm.get('tags') as FormArray).controls as FormControl[];
  }

  hasEmptyCharacter(): boolean {
    return this.characters.some((char) => {
      const value = char.value;
      return !value || (typeof value === 'string' && value.trim() === '');
    });
  }
}
