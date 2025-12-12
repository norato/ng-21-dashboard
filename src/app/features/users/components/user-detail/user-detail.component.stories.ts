import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { UserDetailComponent } from './user-detail.component';
import { UserStore } from '../../store/user.store';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';

const mockUser: User = {
  id: 1,
  name: 'Leanne Graham',
  username: 'Bret',
  email: 'leanne@example.com',
  address: {
    street: 'Kulas Light',
    suite: 'Apt. 556',
    city: 'Gwenborough',
    zipcode: '92998-3874',
    geo: {
      lat: '-37.3159',
      lng: '81.1496',
    },
  },
  phone: '1-770-736-8031 x56442',
  website: 'hildegard.org',
  company: {
    name: 'Romaguera-Crona',
    catchPhrase: 'Multi-layered client-server neural-net',
    bs: 'harness real-time e-markets',
  },
};

const meta: Meta<UserDetailComponent> = {
  title: 'Users/UserDetail/UserDetail',
  component: UserDetailComponent,
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: UserStore,
          useValue: {
            selectedUser: signal(mockUser),
            isLoading: signal(false),
            error: signal(null),
            loadUserById: () => {},
            clearSelectedUser: () => {},
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: () => Promise.resolve(true),
          },
        },
      ],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<UserDetailComponent>;

export const Default: Story = {};

export const Loading: Story = {
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: UserStore,
          useValue: {
            selectedUser: signal(null),
            isLoading: signal(true),
            error: signal(null),
            loadUserById: () => {},
            clearSelectedUser: () => {},
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: () => Promise.resolve(true),
          },
        },
      ],
    }),
  ],
};

export const Error: Story = {
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: UserStore,
          useValue: {
            selectedUser: signal(null),
            isLoading: signal(false),
            error: signal('Failed to load user'),
            loadUserById: () => {},
            clearSelectedUser: () => {},
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: () => Promise.resolve(true),
          },
        },
      ],
    }),
  ],
};
