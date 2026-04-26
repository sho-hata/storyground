import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from './LoginForm';

const meta = {
  title: 'Pages/LoginForm',
  component: LoginForm,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
