'use client'

import GithubLoginButton from '@/components/Shared/GithubLoginButton'
import { useAuth } from '@/hooks'
import { ArrowForwardOutlined } from '@mui/icons-material'
import {
  Organization,
  Platforms,
  UserRead,
  UserSignupType,
} from '@polar-sh/sdk'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogoIcon } from 'polarkit/components/brand'
import { Button } from 'polarkit/components/ui/atoms'
import { useCallback } from 'react'

import {
  backerRoutes,
  unauthenticatedRoutes,
} from '@/components/Dashboard/navigation'
import { useMaintainerUpgrade } from 'polarkit/hooks'
import TopbarNavigation from './TopbarNavigation'
import TopbarRight from './TopbarRight'

const Topbar = ({
  hideProfile,
  authenticatedUser,
  userAdminOrganizations,
}: {
  hideProfile?: boolean
  authenticatedUser: UserRead | undefined
  userAdminOrganizations: Organization[]
}) => {
  // Fallback to client side user loading
  const { currentUser: clientCurrentUser } = useAuth()
  const currentUser = authenticatedUser ?? clientCurrentUser

  const personalOrg = userAdminOrganizations?.find((o) => o.is_personal)

  const router = useRouter()

  const hasAdminOrgs = Boolean(
    userAdminOrganizations && userAdminOrganizations.length > 0,
  )

  const creatorPath = personalOrg
    ? `/maintainer/${currentUser?.username}/overview`
    : `/maintainer/${userAdminOrganizations?.[0]?.name}/overview`

  const maintainerUpgrade = useMaintainerUpgrade()

  const upgradeToMaintainer = useCallback(async () => {
    await maintainerUpgrade.mutateAsync()
    router.push(`/maintainer/${currentUser?.username}/overview`)
  }, [currentUser])

  const githubAccount = currentUser?.oauth_accounts.find(
    (o) => o.platform === Platforms.GITHUB,
  )
  const shouldShowGitHubAuthUpsell = !githubAccount

  const upsellOrDashboard = () => {
    if (!currentUser) {
      return null
    }

    if (shouldShowGitHubAuthUpsell) {
      return (
        <GithubLoginButton
          className="border-none bg-blue-500 text-white hover:bg-blue-400 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-400 dark:hover:text-white"
          text="Connect with GitHub"
          returnTo={window?.location?.href ?? '/feed'}
          userSignupType={UserSignupType.BACKER}
        />
      )
    }

    if (hasAdminOrgs) {
      return (
        <Link href={creatorPath}>
          <Button>
            <div className="flex flex-row items-center gap-x-2">
              <span className="text-xs">Creator Dashboard</span>
              <ArrowForwardOutlined fontSize="inherit" />
            </div>
          </Button>
        </Link>
      )
    }

    return (
      <Button
        onClick={upgradeToMaintainer}
        loading={maintainerUpgrade.isPending}
      >
        <div className="flex flex-row items-center gap-x-2">
          <span className="text-xs">Become a Creator</span>
          <ArrowForwardOutlined fontSize="inherit" />
        </div>
      </Button>
    )
  }

  const upsell = upsellOrDashboard()

  const routes = authenticatedUser ? backerRoutes() : unauthenticatedRoutes

  return (
    <div className="dark:border-b-polar-800 dark:bg-polar-950 sticky top-0 z-50 flex w-full flex-col items-center justify-start border-b border-b-gray-100 bg-white py-4">
      <div className="flex w-full max-w-7xl flex-col items-stretch justify-between gap-y-4 px-2 md:flex-row md:items-center">
        <div className="flex flex-row items-center gap-x-4 md:gap-x-16">
          <Link href="/">
            <LogoIcon className="text-blue-500 dark:text-blue-400" size={42} />
          </Link>
          <div className="flex flex-row items-center gap-4">
            <TopbarNavigation routes={routes} />
          </div>
        </div>
        {!hideProfile ? (
          <div className="flex flex-row items-center justify-between gap-x-4">
            {upsell}
            <TopbarRight authenticatedUser={authenticatedUser} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Topbar