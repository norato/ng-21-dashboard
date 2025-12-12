import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CardModule],
  templateUrl: './user-card.component.html',
})
export class UserCardComponent {
  user = input.required<User>();
  private readonly router = inject(Router);

  onCardClick() {
    this.router.navigate(['/users', this.user().id]);
  }
}
