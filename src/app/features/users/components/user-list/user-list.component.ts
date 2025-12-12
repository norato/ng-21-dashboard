import { Component, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserStore } from '../../store/user.store';
import { UserCardComponent } from '../user-card/user-card.component';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [UserCardComponent, SearchInputComponent],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  readonly store = inject(UserStore);
  readonly searchControl = new FormControl('', { nonNullable: true });

  ngOnInit() {
    this.store.loadUsers();
    this.store.searchUsers(this.searchControl.valueChanges);
  }
}
