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
import { debounceTime, EMPTY, pipe, switchMap } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

export type UserListLoadReason = 'no users cached' | 'cache expired';
export type UserDetailLoadReason = 'different user' | 'cache expired';

type UserState = {
  users: User[];
  usersCachedAt: number | null; // Timestamp do cache da lista de users
  selectedUser: User | null; // Objeto completo do usuário selecionado
  selectedUserId: number | null;
  selectedUserCachedAt: number | null; // Timestamp do cache do selectedUser
  isLoading: boolean;
  error: string | null;
};

const persistedState = loadFromLocalStorage<UserState>(STORAGE_KEYS.USER_STATE);

const initialState: UserState = persistedState || {
  users: [],
  usersCachedAt: null,
  selectedUser: null,
  selectedUserId: null,
  selectedUserCachedAt: null,
  isLoading: false,
  error: null,
};

const CACHE_TTL = 30 * 60 * 1000; // 30 minutos

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withDevtools('[UserStore]'),
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
            const cachedAt = store.usersCachedAt();
            const hasUsers = store.users().length > 0;
            const isCacheValid = cachedAt && Date.now() - cachedAt < CACHE_TTL;

            if (hasUsers && isCacheValid) {
              updateState(store, '[users] load users from cache (hit)', {
                isLoading: false,
                error: null,
              });
              return EMPTY;
            }

            let cacheStatus: UserListLoadReason;
            if (!hasUsers) {
              cacheStatus = 'no users cached';
            } else {
              cacheStatus = 'cache expired';
            }

            updateState(store, `[users] load users started (${cacheStatus})`, {
              isLoading: true,
              error: null,
            });

            return userService.getUsers().pipe(
              tapResponse({
                next: (users) => {
                  updateState(store, '[users] load users success (fetch)', {
                    users,
                    usersCachedAt: Date.now(), // Salva timestamp
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
            const currentSelectedId = store.selectedUserId();
            const cachedAt = store.selectedUserCachedAt();
            const isSameUser = currentSelectedId === userId;
            const isCacheValid = cachedAt && Date.now() - cachedAt < CACHE_TTL;

            if (isSameUser && isCacheValid) {
              const cachedUser = store.users().find((u) => u.id === userId);

              if (cachedUser) {
                updateState(store, '[users] load user from cache (hit)', {
                  selectedUser: cachedUser,
                  selectedUserId: userId,
                  isLoading: false,
                  error: null,
                });
                return EMPTY;
              }
            }

            let cacheStatus: UserDetailLoadReason;
            if (!isSameUser) {
              cacheStatus = 'different user';
            } else {
              cacheStatus = 'cache expired';
            }

            updateState(store, `[users] load user by id started (${cacheStatus})`, {
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

                  updateState(store, '[users] load user by id success (fetch)', {
                    users: updatedUsers,
                    selectedUser: user,
                    selectedUserId: userId,
                    selectedUserCachedAt: Date.now(),
                    isLoading: false,
                  });
                  cacheBus.notifyDataSaved(STORAGE_KEYS.USER_STATE);
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
        updateState(store, '[users] clear selected user', {
          selectedUser: null,
          selectedUserId: null,
          selectedUserCachedAt: null,
        });
      },
      clearCache() {
        updateState(store, '[users] clear cache and reset store', {
          users: [],
          usersCachedAt: null,
          selectedUser: null,
          selectedUserId: null,
          selectedUserCachedAt: null,
          isLoading: false,
          error: null,
        });
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
      // Dispara ação quando store é inicializada com dados do cache
      if (persistedState) {
        const usersCount = persistedState.users?.length || 0;
        const cachedAt = persistedState.usersCachedAt;
        const age = cachedAt ? Date.now() - cachedAt : null;
        const isValid = age !== null && age < CACHE_TTL;

        if (usersCount > 0) {
          updateState(
            store,
            `[users] store initialized from localStorage (${usersCount} users, cache ${isValid ? 'valid' : 'expired'})`,
            {}
          );
        } else {
          updateState(store, '[users] store initialized (empty cache)', {});
        }
      } else {
        updateState(store, '[users] store initialized (no cache)', {});
      }

      // Effect para salvar no localStorage
      effect(() => {
        const state: UserState = {
          users: store.users(),
          usersCachedAt: store.usersCachedAt(),
          selectedUser: store.selectedUser(),
          selectedUserId: store.selectedUserId(),
          selectedUserCachedAt: store.selectedUserCachedAt(),
          isLoading: store.isLoading(),
          error: store.error(),
        };
        saveToLocalStorage(STORAGE_KEYS.USER_STATE, state);
      });
    },
  })
);
