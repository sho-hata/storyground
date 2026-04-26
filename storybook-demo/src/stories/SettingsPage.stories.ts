import type { Meta, StoryObj } from "@storybook/react";
import { SettingsPage } from "./SettingsPage";

const meta = {
  title: "Pages/Settings",
  component: SettingsPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SettingsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
