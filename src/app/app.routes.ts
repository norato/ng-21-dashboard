import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { PostEffects } from './features/posts/store/effects/post.effects';
import { postsPersistenceMetaReducer } from './features/posts/store/meta-reducers/persistence.meta-reducer';
import { postReducer } from './features/posts/store/reducers/post.reducer';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./features/users/components/user-list/user-list.component').then(
        (m) => m.UserListComponent
      ),
  },
  {
    path: 'users/:id',
    loadComponent: () =>
      import('./features/users/components/user-detail/user-detail.component').then(
        (m) => m.UserDetailComponent
      ),
  },
  {
    path: 'posts',
    loadComponent: () =>
      import('./features/posts/components/post-list/post-list.component').then(
        (m) => m.PostListComponent
      ),
    providers: [
      provideState('posts', postReducer, { metaReducers: [postsPersistenceMetaReducer] }),
      provideEffects([PostEffects]),
    ],
  },
];
