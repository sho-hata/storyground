import type { Meta, StoryObj } from '@storybook/react';
import { UserProfile } from './UserProfile';

const meta = {
  title: 'Pages/UserProfile',
  component: UserProfile,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof UserProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: '山田太郎', role: 'シニアデザイナー', avatarUrl: 'https://i.pravatar.cc/150?u=taro' },
};
