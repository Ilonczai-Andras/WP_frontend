import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/auth/auth.service';
import { AboutDto } from '../../../models/aboutDto';

interface Choice {
  gender: string;
}

@Component({
  selector: 'app-profile-dialog',
  imports: [
    DialogModule,
    ButtonModule,
    DropdownModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './profile-dialog.component.html',
  styleUrl: './profile-dialog.component.css',
})
export class ProfileDialogComponent {
  @Input() ShowDialog: boolean = false;
  aboutForm: FormGroup;
  userid: number = 0;

  choices: Choice[] | undefined;

  selectedChoice: Choice | undefined;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private profileService: ProfileService
  ) {
    this.aboutForm = this.createForm();
  }

  ngOnInit() {
    this.choices = [{ gender: 'He/Him' }, { gender: 'She/Her' }];
    this.userid = this.authService.getUserId();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      gender: ['', Validators.required],
      about: ['', [Validators.required, Validators.maxLength(1000)]],
      website: ['', Validators.required],
      location: ['', Validators.required],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.aboutForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.aboutForm.get(fieldName);
    return !!(field && field.valid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.aboutForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${
          field.errors['minlength'].requiredLength
        } characters`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldDisplayName(fieldName)} cannot exceed ${
          field.errors['maxlength'].requiredLength
        } characters`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      gender: 'Gender',
      about: 'About',
      website: 'Website',
      location: 'Location',
    };
    return displayNames[fieldName] || fieldName;
  }

  closeDialog(): void {
    this.ShowDialog = false;
    this.aboutForm.reset();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.aboutForm.controls).forEach((key) => {
      const control = this.aboutForm.get(key);
      control?.markAsTouched();
    });
  }

  onSubmit() {
    if (this.aboutForm.valid) {
      const aboutData = this.aboutForm.value;
      const newAbout: AboutDto = {
        description: aboutData.about,
        gender: aboutData.gender.gender,
        website: aboutData.website,
        location: aboutData.location,
      };

      this.profileService.updateUserProfile(this.userid, newAbout).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'About saved successfully',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to save about data',
          });
        },
      });

      this.closeDialog();
    } else {
      this.markFormGroupTouched();
    }
  }
}
