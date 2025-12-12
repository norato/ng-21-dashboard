import 'zone.js';
import 'zone.js/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { MockBuilder, MockRender } from 'ng-mocks';
import { UserListComponent } from './user-list.component';
import { UserStore } from '../../store/user.store';
import { TableModule } from 'primeng/table';

describe('UserListComponent', () => {
  beforeEach(() => {
    return MockBuilder(UserListComponent)
      .mock(UserStore, {
        users: signal([]),
        isLoading: signal(false),
        error: signal(null),
        loadUsers: vi.fn(),
        searchUsers: vi.fn(),
      })
      .mock(TableModule);
  });

  it('should create the component', () => {
    const fixture = MockRender(UserListComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should load users on init', () => {
    const fixture = MockRender(UserListComponent);
    const component = fixture.point.componentInstance;

    expect(component.store.loadUsers).toHaveBeenCalled();
  });
});
