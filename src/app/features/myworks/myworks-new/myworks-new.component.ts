import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { RouterModule } from '@angular/router';
import { MyWorksHeaderComponent } from './myworks-header/myworks-header.component';
import { MyworksBodyComponent } from './myworks-body/myworks-body.component';
import { LayoutService } from '../../../core/services/layout.service';

@Component({
  selector: 'app-myworks-new-page',
  imports: [RouterModule, MyWorksHeaderComponent, MyworksBodyComponent],
  templateUrl: './myworks-new.component.html',
  styleUrl: './myworks-new.component.css',
})
export class MyworksNewComponent implements OnInit {
  private destroy$ = new Subject<void>();

  constructor(private layoutService: LayoutService) {}

  ngOnInit(): void {
    this.layoutService.setHeader(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
