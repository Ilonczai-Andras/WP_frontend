import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-reading-list-modal',
  imports: [DialogModule, FormsModule, ButtonModule],
  templateUrl: './reading-list-modal.component.html',
  styleUrl: './reading-list-modal.component.css'
})
export class ReadingListModalComponent  {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() create = new EventEmitter<string>();

  readingListName = '';

  closeDialog() {
    this.visibleChange.emit(false);
  }

  onCreate() {
    if (this.readingListName.trim()) {
      this.create.emit(this.readingListName.trim());
      this.readingListName = '';
      this.closeDialog();
    }
  }
}
