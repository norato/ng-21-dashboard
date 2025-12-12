import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-user-detail-skeleton',
  standalone: true,
  imports: [CardModule, SkeletonModule],
  templateUrl: './user-detail-skeleton.component.html',
})
export class UserDetailSkeletonComponent {}
