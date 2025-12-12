import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { updateState } from '@angular-architects/ngrx-toolkit';
import { pipe, switchMap } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

type UserState = {
  users: User[];
  isLoading: boolean;
  error: string | null;
};

const initialState: UserState = {
  users: [],
  isLoading: false,
  error: null,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, userService = inject(UserService)) => ({
    loadUsers: rxMethod<void>(
      pipe(
        switchMap(() => {
          updateState(store, '[users] load users started', { isLoading: true, error: null });
          return userService.getUsers().pipe(
            tapResponse({
              next: (users) =>
                updateState(store, '[users] load users success', { users, isLoading: false }),
              error: (error: Error) =>
                updateState(store, '[users] load users error', {
                  error: error.message,
                  isLoading: false,
                }),
            })
          );
        })
      )
    ),
  }))
);
