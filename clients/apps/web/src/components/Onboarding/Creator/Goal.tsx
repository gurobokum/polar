import { motion } from 'framer-motion'

export interface GoalProps {
  title: string
  value: number
  max: number
}

export const Goal = ({ title, value, max }: GoalProps) => {
  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-row items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <span>
          {value} / {max}
        </span>
      </div>
      <div>
        <div className="relative flex h-2 w-full flex-row items-center overflow-hidden rounded-md bg-blue-50 dark:bg-blue-950">
          <motion.div
            className="h-full rounded-md bg-blue-500 dark:bg-blue-400"
            style={{ width: `${(value / max) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}