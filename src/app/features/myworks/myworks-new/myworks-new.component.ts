import { Component } from '@angular/core';
import { MyWorksHeaderComponent } from './myworks-header/myworks-header.component';
import { MyworksBodyComponent } from './myworks-body/myworks-body.component';

@Component({
  selector: 'app-myworks-new',
  imports: [MyWorksHeaderComponent, MyworksBodyComponent],
  templateUrl: './myworks-new.component.html',
  styleUrl: './myworks-new.component.css',
})
export class MyworksNewComponent {}
