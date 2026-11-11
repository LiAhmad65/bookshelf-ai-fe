import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const baseProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

const icon = (paths: ReactNode) =>
  function Icon({ size = 20, ...rest }: IconProps) {
    return (
      <svg width={size} height={size} {...baseProps} {...rest}>
        {paths}
      </svg>
    )
  }

export const EyeIcon = icon(
  <>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </>,
)

export const TrashIcon = icon(<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6" />)

export const GridIcon = icon(
  <>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </>,
)

export const ListIcon = icon(<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />)

export const ChevronLeftIcon = icon(<path d="m15 18-6-6 6-6" />)

export const ChevronRightIcon = icon(<path d="m9 18 6-6-6-6" />)

export const ChevronDownIcon = icon(<path d="m6 9 6 6 6-6" />)

export const SunIcon = icon(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </>,
)

export const MoonIcon = icon(<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />)

export const ChatIcon = icon(<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />)

export const SendIcon = icon(<path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />)

export const StopIcon = icon(<rect x="6" y="6" width="12" height="12" rx="2" />)

export const CloseIcon = icon(<path d="M18 6 6 18M6 6l12 12" />)

export const SparklesIcon = icon(
  <>
    <path d="M10 3.5 11.6 8.4 16.5 10l-4.9 1.6L10 16.5l-1.6-4.9L3.5 10l4.9-1.6Z" />
    <path d="M18 14v6M15 17h6" />
  </>,
)
