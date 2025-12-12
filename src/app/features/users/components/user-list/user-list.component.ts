import { Component, inject, OnInit } from '@angular/core';
import { UserStore } from '../../store/user.store';
import { UserCardComponent } from '../user-card/user-card.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [UserCardComponent],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  readonly store = inject(UserStore);

  ngOnInit() {
    this.store.loadUsers();
  }
}
