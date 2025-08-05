import { Component, Input } from '@angular/core';
import { ReadingListItemResponseDto } from '../../../../../models/readingListItemResponseDto';
import { RouterLink } from '@angular/router';
import { ReplaceSpacesPipe } from "../../../../../shared/pipes/replace-spaces.pipe";
import { LowerCasePipe } from '@angular/common';

@Component({
  selector: 'app-reading-list-item',
  imports: [RouterLink, ReplaceSpacesPipe, LowerCasePipe],
  templateUrl: './reading-list-item.component.html',
  styleUrl: './reading-list-item.component.css',
})
export class ReadingListItemComponent {
  @Input() story!: ReadingListItemResponseDto;
}
