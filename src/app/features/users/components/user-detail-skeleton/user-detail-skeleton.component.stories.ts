import type { Meta, StoryObj } from '@storybook/angular';
import { UserDetailSkeletonComponent } from './user-detail-skeleton.component';

const meta: Meta<UserDetailSkeletonComponent> = {
  title: 'Users/UserDetail/UserDetailSkeleton',
  component: UserDetailSkeletonComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<UserDetailSkeletonComponent>;

export const Default: Story = {};
