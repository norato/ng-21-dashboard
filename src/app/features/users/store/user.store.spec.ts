import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import 'zone.js';
import 'zone.js/testing';
import { User } from '../models/user.model';
import { UserStore } from './user.store';

describe('UserStore', () => {
  let store: InstanceType<typeof UserStore>;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    address: {
      street: 'Main St',
      suite: 'Apt 1',
      city: 'New York',
      zipcode: '10001',
      geo: {
        lat: '40.7128',
        lng: '-74.0060',
      },
    },
    phone: '123-456-7890',
    website: 'johndoe.com',
    company: {
      name: 'Acme Corp',
      catchPhrase: 'Innovation at its finest',
      bs: 'cutting-edge solutions',
    },
  };

  const mockUsers: User[] = [mockUser];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserStore, provideHttpClient(), provideHttpClientTesting()],
    });

    store = TestBed.inject(UserStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('searchUsers', () => {
    it('should update store with search results', async () => {
      const searchQuery = 'John';

      store.searchUsers(searchQuery);

      await new Promise((resolve) => setTimeout(resolve, 350));
      const req = httpMock.expectOne((req) => req.url.includes(`name_like=${searchQuery}`));
      req.flush(mockUsers);

      expect(store.users()).toEqual(mockUsers);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBe(null);
    });

    it('should set loading state during search', async () => {
      store.searchUsers('John');

      await new Promise((resolve) => setTimeout(resolve, 350));
      expect(store.isLoading()).toBe(true);

      const req = httpMock.expectOne(() => true);
      req.flush(mockUsers);

      expect(store.isLoading()).toBe(false);
    });

    it('should handle search errors', async () => {
      const searchQuery = 'John';
      const errorMessage = 'Search failed';

      store.searchUsers(searchQuery);

      await new Promise((resolve) => setTimeout(resolve, 350));
      const req = httpMock.expectOne(() => true);
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });

      expect(store.error()).toBeTruthy();
      expect(store.isLoading()).toBe(false);
    });

    it('should search with empty query', async () => {
      store.searchUsers('');

      await new Promise((resolve) => setTimeout(resolve, 350));
      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      req.flush(mockUsers);

      expect(store.users()).toEqual(mockUsers);
    });
  });

  describe('loadUsers', () => {
    it('should load all users', () => {
      store.loadUsers();

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);

      expect(store.users()).toEqual(mockUsers);
      expect(store.isLoading()).toBe(false);
    });

    it('should set loading state', () => {
      store.loadUsers();
      expect(store.isLoading()).toBe(true);

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      req.flush(mockUsers);

      expect(store.isLoading()).toBe(false);
    });

    it('should handle errors', () => {
      store.loadUsers();

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      expect(store.error()).toBeTruthy();
      expect(store.isLoading()).toBe(false);
    });
  });

  describe('loadUserById', () => {
    it('should load user by id', () => {
      const userId = 1;
      store.loadUserById(userId);

      const req = httpMock.expectOne(`https://jsonplaceholder.typicode.com/users/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);

      expect(store.users()).toContain(mockUser);
      expect(store.selectedUserId()).toBe(userId);
      expect(store.selectedUser()).toEqual(mockUser);
    });

    it('should update existing user in store', () => {
      // First load the user
      store.loadUserById(1);
      const req1 = httpMock.expectOne('https://jsonplaceholder.typicode.com/users/1');
      req1.flush(mockUser);

      // Load same user again with updated data
      const updatedUser = { ...mockUser, name: 'Jane Doe' };
      store.loadUserById(1);
      const req2 = httpMock.expectOne('https://jsonplaceholder.typicode.com/users/1');
      req2.flush(updatedUser);

      expect(store.users().length).toBe(1);
      expect(store.users()[0].name).toBe('Jane Doe');
    });

    it('should add new user to existing users', () => {
      // Load first user
      store.loadUserById(1);
      const req1 = httpMock.expectOne('https://jsonplaceholder.typicode.com/users/1');
      req1.flush(mockUser);

      // Load second user
      const mockUser2 = { ...mockUser, id: 2, name: 'Jane Doe' };
      store.loadUserById(2);
      const req2 = httpMock.expectOne('https://jsonplaceholder.typicode.com/users/2');
      req2.flush(mockUser2);

      expect(store.users().length).toBe(2);
    });
  });

  describe('selectUser', () => {
    it('should select user by id', () => {
      store.selectUser(1);
      expect(store.selectedUserId()).toBe(1);
    });
  });

  describe('clearSelectedUser', () => {
    it('should clear selected user', () => {
      store.selectUser(1);
      expect(store.selectedUserId()).toBe(1);

      store.clearSelectedUser();
      expect(store.selectedUserId()).toBe(null);
      expect(store.selectedUser()).toBe(null);
    });
  });

  describe('selectedUser computed', () => {
    it('should return null when no user is selected', () => {
      expect(store.selectedUser()).toBe(null);
    });

    it('should return selected user from store', () => {
      store.loadUserById(1);
      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users/1');
      req.flush(mockUser);

      expect(store.selectedUser()).toEqual(mockUser);
    });
  });
});
