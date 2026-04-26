import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: { name: "Taro Yamada", src: "https://i.pravatar.cc/150?u=taro", size: "lg" },
};
export const Initials: Story = { args: { name: "Taro Yamada", size: "lg" } };
