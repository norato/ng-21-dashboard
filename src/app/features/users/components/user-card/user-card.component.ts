import { Component, input } from '@angular/core';
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
}
