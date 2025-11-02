import type { ComponentPropsWithoutRef } from 'react'

type IconProps = ComponentPropsWithoutRef<'svg'>

export function SearchIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <circle cx={11} cy={11} r={7} />
      <line x1={20} y1={20} x2={16.65} y2={16.65} />
    </svg>
  )
}

export function HeartIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden {...props}>
      <path d="M12 21s-6.5-4.35-9.5-8.35c-2.5-3.3-.5-8.3 3.8-8.6 2.15-.17 4.1 1.06 5.2 2.86 1.1-1.8 3.05-3.03 5.2-2.86 4.3.3 6.3 5.3 3.8 8.6C18.5 16.65 12 21 12 21Z" />
    </svg>
  )
}

export function HeartFilledIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 21s-6.5-4.35-9.5-8.35c-2.5-3.3-.5-8.3 3.8-8.6 2.15-.17 4.1 1.06 5.2 2.86 1.1-1.8 3.05-3.03 5.2-2.86 4.3.3 6.3 5.3 3.8 8.6C18.5 16.65 12 21 12 21Z" />
    </svg>
  )
}

export function CartIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden {...props}>
      <path d="M3 4h2l1.6 9.2a2 2 0 0 0 2 1.7H17a2 2 0 0 0 2-1.5l1-4.5H7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={9} cy={20} r={1.4} />
      <circle cx={17} cy={20} r={1.4} />
    </svg>
  )
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden {...props}>
      <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function FilterIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden {...props}>
      <path d="M4 5h16M7 12h10M10 19h4" strokeLinecap="round" />
    </svg>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden {...props}>
      <line x1={6} y1={6} x2={18} y2={18} strokeLinecap="round" />
      <line x1={6} y1={18} x2={18} y2={6} strokeLinecap="round" />
    </svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden {...props}>
      <polyline points="4 12 9 17 20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function UserIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden
      {...props}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx={12} cy={7} r={4} />
    </svg>
  )
}