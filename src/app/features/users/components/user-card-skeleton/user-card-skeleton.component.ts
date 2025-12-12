import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-user-card-skeleton',
  standalone: true,
  imports: [CardModule, SkeletonModule],
  templateUrl: './user-card-skeleton.component.html',
})
export class UserCardSkeletonComponent {}
