import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ButtonModule } from 'primeng/button';

const meta: Meta = {
  title: 'PrimeNG/Button',
  decorators: [
    moduleMetadata({
      imports: [ButtonModule],
    }),
  ],
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `
      <p-button
        [label]="label"
        [icon]="icon"
        [severity]="severity"
        [size]="size"
        [outlined]="outlined"
        [raised]="raised"
        [rounded]="rounded"
        [text]="text"
        [disabled]="disabled"
        [loading]="loading"
        [iconPos]="iconPos"
      ></p-button>
    `,
  }),
  argTypes: {
    label: { control: 'text' },
    severity: {
      control: 'select',
      options: ['success', 'info', 'warning', 'danger', 'help', 'secondary', 'contrast', undefined],
    },
  },
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  args: {
    label: 'Primary Button',
  },
};
