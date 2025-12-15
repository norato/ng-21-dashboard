import { CacheMessageBus, clearFromLocalStorage, STORAGE_KEYS } from '$core';
import { SearchInputComponent } from '$shared';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { UserStore } from '../../store/user.store';
import { UserCardSkeletonComponent } from '../user-card-skeleton/user-card-skeleton.component';
import { UserCardComponent } from '../user-card/user-card.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [UserCardComponent, SearchInputComponent, UserCardSkeletonComponent],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  readonly store = inject(UserStore);
  readonly searchControl = new FormControl('', { nonNullable: true });
  private readonly cacheBus = inject(CacheMessageBus);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    // Registra que essa página usa USER_STATE
    this.cacheBus.setActiveStore(STORAGE_KEYS.USER_STATE);

    // Carrega dados inicial
    this.store.loadUsers();
    this.store.searchUsers(this.searchControl.valueChanges);

    // Escuta eventos de reload específicos para USER_STATE
    this.cacheBus.reloadRequested$
      .pipe(
        filter((storeName) => storeName === STORAGE_KEYS.USER_STATE),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        // Limpa cache da store (dispara named action) + localStorage
        this.store.clearCache();
        clearFromLocalStorage(STORAGE_KEYS.USER_STATE);
        // Força novo fetch
        this.store.loadUsers();
      });
  }
}
