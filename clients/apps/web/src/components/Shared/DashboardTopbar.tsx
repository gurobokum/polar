'use client'

import {
  useAuth,
  useCurrentOrgAndRepoFromURL,
  useCurrentTeamFromURL,
} from '@/hooks'
import { Organization } from '@polar-sh/sdk'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PropsWithChildren, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  Route,
  SubRoute,
  backerRoutes,
  maintainerRoutes,
} from '../Dashboard/navigation'

export type LogoPosition = 'center' | 'left'

const SubNav = (props: { items: (SubRoute & { active: boolean })[] }) => {
  return (
    <div className="dark:bg-polar-900 dark:border-polar-700 flex flex-row items-center gap-x-2 rounded-xl bg-gray-200 p-1 dark:border">
      {props.items.map((item) => {
        const className = twMerge(
          item.active
            ? 'bg-gray-50 dark:bg-polar-700 shadow-md text-gray-950 dark:text-polar-100 font-medium'
            : 'text-gray-600 dark:text-polar-500 hover:text-gray-950 dark:hover:text-polar-300 hover:bg-gray-200 dark:hover:bg-polar-700',
          'dark-bg-900 flex flex-row rounded-lg px-4 py-2 text-xs transition-colors',
        )

        return (
          <Link key={item.title} href={item.link} className={className}>
            {item.title}
          </Link>
        )
      })}
    </div>
  )
}

const DashboardTopbar = ({
  children,
  hideProfile,
  ...props
}: PropsWithChildren<{
  useOrgFromURL: boolean
  hideProfile?: boolean
  isFixed?: boolean
}>) => {
  const { org: currentOrgFromURL } = useCurrentOrgAndRepoFromURL()
  const { org: currentTeamFromURL } = useCurrentTeamFromURL()

  const { hydrated } = useAuth()

  const useOrgFromURL = props.useOrgFromURL

  const currentOrg = useMemo(() => {
    if (!useOrgFromURL) {
      return undefined
    }

    if (currentTeamFromURL) {
      return currentTeamFromURL
    }

    if (currentOrgFromURL) {
      return currentOrgFromURL
    }

    return undefined
  }, [currentOrgFromURL, useOrgFromURL, currentTeamFromURL])

  const pathname = usePathname()

  const getRoutes = (pathname: string, currentOrg?: Organization): Route[] => {
    if (pathname && pathname.startsWith('/maintainer/') && currentOrg) {
      return maintainerRoutes(currentOrg)
    }

    if (pathname && pathname.startsWith('/team/') && currentOrg) {
      return maintainerRoutes(currentOrg)
    }

    return backerRoutes
  }

  const routes = getRoutes(pathname, currentOrg)

  const [currentRoute] = routes.filter((route) =>
    pathname?.startsWith(route.link),
  )

  const className = twMerge(
    props.isFixed !== false ? 'fixed z-20 left-0 top-0 right-0' : '',
    'flex h-20 w-full items-center justify-between space-x-4 bg-gray-50 dark:bg-polar-950 border-b border-gray-200 dark:border-polar-700',
  )

  if (!hydrated) {
    return <></>
  }

  return (
    <>
      <div className={className}>
        <div className="relative mx-auto flex w-full max-w-screen-2xl flex-row items-center justify-between px-4 sm:px-6 md:px-8">
          <div className="flex flex-row items-center gap-x-24">
            <h4 className="dark:text-polar-100 text-lg font-medium">
              {currentRoute?.title}
            </h4>
            {currentRoute &&
              'subs' in currentRoute &&
              (currentRoute.subs?.length ?? 0) > 0 && (
                <SubNav
                  items={
                    currentRoute.subs?.map((sub) => ({
                      ...sub,
                      active: sub.link === pathname,
                    })) ?? []
                  }
                />
              )}
          </div>
          <div className="flex flex-row items-center gap-x-6">{children}</div>
        </div>
      </div>
    </>
  )
}
export default DashboardTopbar
