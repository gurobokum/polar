import { PolarQueryClientProvider } from '@/app/providers'
import type { Meta, StoryObj } from '@storybook/react'
import { repo } from 'polarkit/testdata'
import BackerLayout from './BackerLayout'
import MaintainerLayout, {
  DashboardBody,
  DashboardHeader,
  RepoPickerHeader,
} from './MaintainerLayout'

const meta: Meta<typeof MaintainerLayout> = {
  title: 'Layouts/MaintainerLayout',
  component: BackerLayout,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
}

export default meta

type Story = StoryObj<typeof MaintainerLayout>

export const Default: Story = {
  parameters: {
    themes: ['light'],
    padding: 'p-0 m-0',
  },
  render: (args) => (
    <PolarQueryClientProvider>
      <MaintainerLayout {...args}>
        <DashboardBody>
          <div className="bg-red-200 text-black">Content</div>
        </DashboardBody>
      </MaintainerLayout>
    </PolarQueryClientProvider>
  ),
}

export const Dark: Story = {
  ...Default,
  parameters: {
    themes: ['dark'],
    padding: 'p-0',
  },
}

export const Header: Story = {
  ...Default,
  args: {
    ...Default.args,
  },
  parameters: {
    themes: ['light'],
    padding: 'p-0',
  },
  render: (args) => {
    return (
      <PolarQueryClientProvider>
        <MaintainerLayout {...args}>
          <DashboardHeader>
            <div className="bg-blue-200">Hello from header</div>,
          </DashboardHeader>
        </MaintainerLayout>
      </PolarQueryClientProvider>
    )
  },
}

export const RepoPicker: Story = {
  ...Default,
  args: {
    ...Default.args,
  },
  parameters: {
    themes: ['light'],
    padding: 'p-0',
  },
  render: (args) => {
    return (
      <PolarQueryClientProvider>
        <MaintainerLayout {...args}>
          <DashboardHeader>
            <RepoPickerHeader currentRepository={repo} repositories={[repo]}>
              <input
                type="text"
                name="query"
                id="query"
                className="dark:bg-polar-800 dark:text-polar-200 dark:ring-polar-700 block w-full rounded-md border-0  bg-transparent py-2 text-gray-900 placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                placeholder="Example"
              />
            </RepoPickerHeader>
          </DashboardHeader>
        </MaintainerLayout>
      </PolarQueryClientProvider>
    )
  },
}
