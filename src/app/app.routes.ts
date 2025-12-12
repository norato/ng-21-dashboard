import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { postReducer } from './features/posts/store/reducers/post.reducer';
import { PostEffects } from './features/posts/store/effects/post.effects';

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
    providers: [provideState('posts', postReducer), provideEffects([PostEffects])],
  },
];
