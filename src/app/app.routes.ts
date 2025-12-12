import { Routes } from '@angular/router';

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
];
