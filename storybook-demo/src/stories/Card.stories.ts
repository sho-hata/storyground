import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: {
    title: 'プロジェクト進捗',
    description: 'デザインシステムの v2.0 リリースに向けた進捗レポートです。',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=640&h=360&fit=crop',
    tags: ['デザイン', 'v2.0'],
    footerAction: '詳細 →',
  },
};
