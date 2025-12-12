import type { Meta, StoryObj } from '@storybook/angular';
import { UserCardSkeletonComponent } from './user-card-skeleton.component';

const meta: Meta<UserCardSkeletonComponent> = {
  title: 'Users/UserCard/UserCardSkeleton',
  component: UserCardSkeletonComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<UserCardSkeletonComponent>;

export const Default: Story = {};

export const MultipleCards: Story = {
  render: () => ({
    template: `
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <app-user-card-skeleton />
        <app-user-card-skeleton />
        <app-user-card-skeleton />
        <app-user-card-skeleton />
        <app-user-card-skeleton />
        <app-user-card-skeleton />
      </div>
    `,
  }),
};
