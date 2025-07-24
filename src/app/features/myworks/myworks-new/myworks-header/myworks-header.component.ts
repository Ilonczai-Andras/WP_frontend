import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-myworks-header',
  imports: [],
  templateUrl: './myworks-header.component.html',
  styleUrl: './myworks-header.component.css',
})
export class MyWorksHeaderComponent {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
