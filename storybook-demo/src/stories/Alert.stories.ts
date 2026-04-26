import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Error: Story = {
  args: { title: 'エラーが発生しました', message: 'もう一度お試しください。問題が解決しない場合はサポートにお問い合わせください。', variant: 'error' },
};
