const PATHS = {
  hammer: 'M14 4l6 6-2 2-2-2-9 9-3-3 9-9-2-2z M13 5l2-2 6 6-2 2',
  mug: 'M4 6h12v9a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z M16 9h2a3 3 0 0 1 0 6h-2 M7 2v2 M10 2v2 M13 2v2',
  wrench: 'M14.5 4a5 5 0 0 0-4.6 6.9L3.5 17.3a1.8 1.8 0 0 0 2.6 2.6l6.4-6.4A5 5 0 0 0 19.4 9l-3 3-3-.6-.6-3 3-3a5 5 0 0 0-1.3-.4z',
  sparkle: 'M4 20L14 10 M12 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1z M19 9l.7 1.3L21 11l-1.3.7L19 13l-.7-1.3L17 11l1.3-.7z M18 2l.5 1 1 .5-1 .5-.5 1-.5-1-1-.5 1-.5z',
  arrowUpRight: 'M7 17L17 7 M9 7h8v8',
  arrowRight: 'M4 12h15 M13 6l6 6-6 6',
  chevronRight: 'M9 5l7 7-7 7',
  calendar: 'M4 6h16v14H4z M4 10h16 M8 3v5 M16 3v5',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0',
  comments: 'M4 5h12v8H9l-4 3v-3H4z M16 9h4v8h-1v3l-4-3h-5v-4',
  search: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z M15.5 15.5L21 21',
  send: 'M21 3L3 10l7 3 3 7z M10 13l11-10',
  pin: 'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  mail: 'M3 6h18v12H3z M3 7l9 6 9-6',
  camera: 'M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M17 7.2v.1',
  menu: 'M4 7h16 M4 12h16 M4 17h16',
  close: 'M6 6l12 12 M18 6L6 18',
} as const

export type IconName = keyof typeof PATHS | 'facebook' | 'linkedin' | 'venmo' | 'instagram'

const LETTERS: Partial<Record<IconName, string>> = { facebook: 'f', linkedin: 'in', venmo: 'V' }

interface IconProps {
  name: IconName
  size?: number
  className?: string
}

export default function Icon({ name, size = 20, className }: IconProps) {
  const letter = LETTERS[name]
  if (letter) {
    return (
      <span className={`icon-letter ${className ?? ''}`} aria-hidden="true">
        {letter}
      </span>
    )
  }
  const d = PATHS[(name === 'instagram' ? 'camera' : name) as keyof typeof PATHS]
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  )
}
