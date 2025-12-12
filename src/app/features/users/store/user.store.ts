import {
  CacheMessageBus,
  GLOBAL_ERROR_CODES,
  loadFromLocalStorage,
  saveToLocalStorage,
  STORAGE_KEYS,
  ToastService,
} from '$core';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, effect, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, pipe, switchMap } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

type UserState = {
  users: User[];
  selectedUserId: number | null;
  isLoading: boolean;
  error: string | null;
};

const persistedState = loadFromLocalStorage<UserState>(STORAGE_KEYS.USER_STATE);

const initialState: UserState = persistedState || {
  users: [],
  selectedUserId: null,
  isLoading: false,
  error: null,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withDevtools('[UserStore]'),
  withComputed((store) => ({
    selectedUser: computed(() => {
      const userId = store.selectedUserId();
      return store.users().find((user) => user.id === userId) ?? null;
    }),
  })),
  withMethods(
    (
      store,
      userService = inject(UserService),
      toastService = inject(ToastService),
      cacheBus = inject(CacheMessageBus)
    ) => ({
      loadUsers: rxMethod<void>(
        pipe(
          switchMap(() => {
            updateState(store, '[users] load users started', { isLoading: true, error: null });
            return userService.getUsers().pipe(
              tapResponse({
                next: (users) => {
                  updateState(store, '[users] load users success', {
                    users,
                    isLoading: false,
                  });
                  cacheBus.notifyDataSaved(STORAGE_KEYS.USER_STATE);
                },
                error: (error: any) => {
                  if (!GLOBAL_ERROR_CODES.includes(error.status)) {
                    toastService.showError('Error loading users');
                  }
                  updateState(store, '[users] load users error', {
                    error: error.message,
                    isLoading: false,
                  });
                },
              })
            );
          })
        )
      ),
      loadUserById: rxMethod<number>(
        pipe(
          switchMap((userId) => {
            updateState(store, '[users] load user by id started', {
              isLoading: true,
              error: null,
              selectedUserId: userId,
            });
            return userService.getUserById(userId).pipe(
              tapResponse({
                next: (user) => {
                  const currentUsers = store.users();
                  const existingIndex = currentUsers.findIndex((u) => u.id === user.id);
                  const updatedUsers =
                    existingIndex >= 0
                      ? currentUsers.map((u) => (u.id === user.id ? user : u))
                      : [...currentUsers, user];

                  updateState(store, '[users] load user by id success', {
                    users: updatedUsers,
                    isLoading: false,
                  });
                },
                error: (error: any) => {
                  if (!GLOBAL_ERROR_CODES.includes(error.status)) {
                    toastService.showError('Error loading user');
                  }
                  updateState(store, '[users] load user by id error', {
                    error: error.message,
                    isLoading: false,
                  });
                },
              })
            );
          })
        )
      ),
      selectUser(userId: number) {
        updateState(store, '[users] select user', { selectedUserId: userId });
      },
      clearSelectedUser() {
        updateState(store, '[users] clear selected user', { selectedUserId: null });
      },
      searchUsers: rxMethod<string>(
        pipe(
          debounceTime(300),
          switchMap((query) => {
            updateState(store, '[users] search users started', { isLoading: true, error: null });
            return userService.searchUsers(query).pipe(
              tapResponse({
                next: (users) =>
                  updateState(store, '[users] search users success', { users, isLoading: false }),
                error: (error: any) => {
                  if (!GLOBAL_ERROR_CODES.includes(error.status)) {
                    toastService.showError('Error searching users');
                  }
                  updateState(store, '[users] search users error', {
                    error: error.message,
                    isLoading: false,
                  });
                },
              })
            );
          })
        )
      ),
    })
  ),
  withHooks({
    onInit(store) {
      effect(() => {
        const state: UserState = {
          users: store.users(),
          selectedUserId: store.selectedUserId(),
          isLoading: store.isLoading(),
          error: store.error(),
        };
        saveToLocalStorage(STORAGE_KEYS.USER_STATE, state);
      });
    },
  })
);
