import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'メールアドレス', placeholder: 'user@example.com', type: 'email' },
};
