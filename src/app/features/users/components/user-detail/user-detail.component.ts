import { Component, effect, inject, input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { UserStore } from '../../store/user.store';
import { UserDetailSkeletonComponent } from '../user-detail-skeleton/user-detail-skeleton.component';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CardModule, ButtonModule, UserDetailSkeletonComponent],
  templateUrl: './user-detail.component.html',
})
export class UserDetailComponent implements OnDestroy {
  id = input.required<string>();

  private readonly router = inject(Router);
  readonly store = inject(UserStore);

  constructor() {
    effect(() => {
      const userId = this.id();
      if (userId) {
        this.store.loadUserById(+userId);
      }
    });
  }

  ngOnDestroy() {
    this.store.clearSelectedUser();
  }

  goBack() {
    this.router.navigate(['/users']);
  }
}
