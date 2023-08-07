import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { PolarTimeAgo } from 'polarkit/components/ui'
import { getCentsInDollarString } from 'polarkit/money'
import { Issue, Organization, Repository } from '../../api/client'
import { githubIssueUrl } from '../../github'

const IssueCard = ({
  issue,
  className,
  organization,
  repository,
}: {
  issue: Issue
  className: string
  organization: Organization
  repository: Repository
}) => {
  const url = githubIssueUrl(organization.name, repository.name, issue.number)

  const fundingProgress =
    'funding' in issue && 'repository' in issue ? (
      <FundingGoal issue={issue} />
    ) : (
      <>{JSON.stringify(issue)}</>
    )

  return (
    <>
      <div
        className={`flex h-full flex-col content-center justify-center rounded-lg border border-gray-200 px-6 ${className}`}
      >
        <div className="flex-1"></div>

        <div className="pt-8 pb-8">
          <strong className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Issue to be fixed
          </strong>
          <h1 className="my-2.5 text-xl font-normal">{issue.title}</h1>
          <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
            <a href={url}>#{issue.number}</a> opened{' '}
            <PolarTimeAgo date={new Date(issue.issue_created_at)} />
          </p>
          <div className="mt-3 flex flex-row justify-center space-x-2">
            <p className="w-16 text-sm text-gray-600 dark:text-gray-400">
              <span className="mr-2">👍</span> {issue?.reactions?.plus_one || 0}
            </p>
            <p className="h-4 w-16 text-sm text-gray-500 dark:text-gray-400">
              <span className="relative top-1 mr-2 inline-block h-4">
                <ChatBubbleLeftIcon className="h-4 w-4" />
              </span>{' '}
              {issue.comments}
            </p>
          </div>
        </div>

        <div className="flex-1"></div>

        {fundingProgress}
      </div>
    </>
  )
}

const FundingGoal = ({ issue }: { issue: Issue }) => {
  if (
    !issue.funding ||
    !issue.funding.pledges_sum ||
    !issue.funding.funding_goal
  ) {
    return <></>
  }

  const progress = Math.max(
    Math.min(
      (issue.funding.pledges_sum.amount / issue.funding.funding_goal.amount) *
        100,
      100, // Max 100
    ),
    1, // Min 1
  )

  return (
    <div className="-mt-4 flex flex-col items-center space-y-2 pb-4">
      <div className="text-gray-500 dark:text-gray-400">
        <span className="font-medium text-gray-700 dark:text-gray-200">
          ${getCentsInDollarString(issue.funding.pledges_sum.amount)}
        </span>{' '}
        / ${getCentsInDollarString(issue.funding.funding_goal.amount)} pledged
      </div>

      <div className="flex w-full overflow-hidden rounded-md">
        <div
          className="h-2  bg-blue-700"
          style={{ width: `${progress}%` }}
        ></div>
        <div className="h-2 flex-1 bg-blue-200 dark:bg-blue-800"></div>
      </div>
    </div>
  )
}

export default IssueCard
