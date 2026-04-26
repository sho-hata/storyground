import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = { args: { label: '公開中', variant: 'success', dot: true } };
export const Warning: Story = { args: { label: 'レビュー待ち', variant: 'warning', dot: true } };
