'use client'

import {
  ArrowDownwardOutlined,
  ContentPasteOutlined,
} from '@mui/icons-material'
import Link from 'next/link'
import { LogoIcon } from 'polarkit/components/brand'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from 'polarkit/components/ui/dropdown-menu'
import { useOutsideClick } from 'polarkit/utils'
import { MouseEventHandler, useCallback, useRef, useState } from 'react'

export const BrandingMenu = () => {
  const brandingMenuRef = useRef<HTMLDivElement>(null)

  useOutsideClick([brandingMenuRef], () => setBrandingMenuOpen(false))

  const [brandingMenuOpen, setBrandingMenuOpen] = useState(false)

  const handleTriggerClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setBrandingMenuOpen(true)
    },
    [],
  )

  const handleCopyLogoToClipboard = useCallback(() => {
    navigator.clipboard.writeText(PolarLogoSVGString)
    setBrandingMenuOpen(false)
  }, [])

  return (
    <div className="relative flex flex-row items-center">
      <DropdownMenu open={brandingMenuOpen}>
        <DropdownMenuTrigger onContextMenu={handleTriggerClick}>
          {/* Do not make this a Link, it breaks the Framer site proxy */}
          <a href="/">
            <LogoIcon className="text-blue-500 dark:text-blue-400" size={42} />
          </a>
        </DropdownMenuTrigger>
        <DropdownMenuContent ref={brandingMenuRef} align="start">
          <DropdownMenuLabel>Platform</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex flex-row gap-x-3"
            onClick={handleCopyLogoToClipboard}
          >
            <ContentPasteOutlined fontSize="inherit" />
            <span>Copy Logo as SVG</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex flex-row gap-x-3"
            onClick={() => setBrandingMenuOpen(false)}
          >
            <ArrowDownwardOutlined fontSize="inherit" />
            <Link href="/assets/brand/polar_brand.zip">
              Download Branding Assets
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

const PolarLogoSVGString = `<svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1_4)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M66.4284 274.26C134.876 320.593 227.925 302.666 274.258 234.219C320.593 165.771 302.666 72.7222 234.218 26.3885C165.77 -19.9451 72.721 -2.0181 26.3873 66.4297C-19.9465 134.877 -2.01938 227.927 66.4284 274.26ZM47.9555 116.67C30.8375 169.263 36.5445 221.893 59.2454 256.373C18.0412 217.361 7.27564 150.307 36.9437 92.318C55.9152 55.2362 87.5665 29.3937 122.5 18.3483C90.5911 36.7105 62.5549 71.8144 47.9555 116.67ZM175.347 283.137C211.377 272.606 244.211 246.385 263.685 208.322C293.101 150.825 282.768 84.4172 242.427 45.2673C264.22 79.7626 269.473 131.542 252.631 183.287C237.615 229.421 208.385 265.239 175.347 283.137ZM183.627 266.229C207.945 245.418 228.016 210.604 236.936 168.79C251.033 102.693 232.551 41.1978 195.112 20.6768C214.97 47.3945 225.022 99.2902 218.824 157.333C214.085 201.724 200.814 240.593 183.627 266.229ZM63.7178 131.844C49.5155 198.43 68.377 260.345 106.374 280.405C85.9962 254.009 75.5969 201.514 81.8758 142.711C86.5375 99.0536 99.4504 60.737 116.225 35.0969C92.2678 55.983 72.5384 90.4892 63.7178 131.844ZM199.834 149.561C200.908 217.473 179.59 272.878 152.222 273.309C124.853 273.742 101.797 219.039 100.724 151.127C99.6511 83.2138 120.968 27.8094 148.337 27.377C175.705 26.9446 198.762 81.648 199.834 149.561Z" fill="#0062FF"/>
</g>
<defs>
<clipPath id="clip0_1_4">
<rect width="300" height="300" fill="white"/>
</clipPath>
</defs>
</svg>`