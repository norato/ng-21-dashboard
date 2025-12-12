import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { UserCardComponent } from './user-card.component';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

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

const meta: Meta<UserCardComponent> = {
  title: 'Users/UserCard/UserCard',
  component: UserCardComponent,
  decorators: [
    moduleMetadata({
      providers: [
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
};

export default meta;
type Story = StoryObj<UserCardComponent>;

export const Default: Story = {
  args: {
    user: mockUser,
  },
};

export const LongName: Story = {
  args: {
    user: {
      ...mockUser,
      name: 'Dr. Extraordinarily Long Name That Should Wrap',
      company: {
        ...mockUser.company,
        name: 'Very Long Company Name Corporation International Ltd.',
      },
    },
  },
};

export const ShortInfo: Story = {
  args: {
    user: {
      ...mockUser,
      name: 'John Doe',
      email: 'john@ex.com',
      company: {
        ...mockUser.company,
        name: 'Acme',
      },
    },
  },
};
