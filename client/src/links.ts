export const SSD = 'https://www.ssdmakerspace.org/'
export const MEETUP = 'https://www.meetup.com/solidstatedepot/events/'
export const MAP = 'https://maps.app.goo.gl/ZcbkXudc1zdUzNop7'
export const EMAIL = 'boulderhackerspace@gmail.com'
export const APPLY = 'https://solidstatedepot.wildapricot.org/join'
export const FACILITIES = SSD + '?page_id=703'
export const SEARCH = SSD

export const HOME = '/'
export const CALENDAR = '/calendar'
export const JOIN = '/join'

export interface MenuLink {
  label: string
  to?: string
  href?: string
}

export interface MenuGroup {
  label: string
  items: MenuLink[]
}

export interface MenuParent {
  label: string
  id: string
  items: (MenuLink | MenuGroup)[]
}

export type MenuEntry = MenuLink | MenuParent

export const isParent = (entry: MenuEntry): entry is MenuParent => 'items' in entry
export const isGroup = (item: MenuLink | MenuGroup): item is MenuGroup => 'items' in item

export const MENU: MenuEntry[] = [
  {
    label: 'About',
    id: 'sub-about',
    items: [
      { label: 'Our Makerspace', href: SSD + '?page_id=1315' },
      { label: 'Mission Statement', href: SSD + '?page_id=1962' },
      { label: 'Facilities', href: FACILITIES },
      { label: 'Equipment Info & Guides', items: [{ label: 'CNC Router (ShopBot) Wiki', href: SSD + '?page_id=1806' }] },
      { label: 'Leadership', href: SSD + '?page_id=1302' },
      { label: 'Rules and Regulations', href: SSD + '?page_id=1325' },
      { label: 'Sponsors', href: SSD + '?page_id=1414' },
      { label: 'Frequently Asked Questions', href: SSD + '?page_id=1996' },
    ],
  },
  { label: 'Donate', href: SSD + '?page_id=1293' },
  { label: 'Projects', href: SSD + '?page_id=1387' },
  { label: 'Calendar', to: CALENDAR },
  {
    label: 'Contact',
    id: 'sub-contact',
    items: [
      { label: 'Slack Channel', href: SSD + '?page_id=1340' },
      { label: 'Email Us', href: SSD + '?page_id=1191' },
    ],
  },
  {
    label: 'Members',
    id: 'sub-members',
    items: [
      { label: 'Login', href: SSD + '?page_id=592' },
      { label: 'Maintenance Request', href: SSD + '?page_id=1371' },
      { label: '3D Printer Status Page', href: SSD + '?page_id=2143' },
      { label: 'Reserve', href: SSD + '?page_id=69' },
      { label: 'Teach', href: SSD + '?page_id=1367' },
      { label: 'Volunteer', href: SSD + '?page_id=1355' },
    ],
  },
]

export const SOCIAL = [
  { label: 'Solid State Depot on Facebook', href: 'https://www.facebook.com/solidstatedepot', icon: 'facebook' },
  { label: 'Solid State Depot on Instagram', href: 'https://www.instagram.com/solidstatedepot/', icon: 'instagram' },
  { label: 'Solid State Depot on LinkedIn', href: 'https://www.linkedin.com/company/solid-state-depot', icon: 'linkedin' },
  { label: 'Donate to Solid State Depot with Venmo', href: 'https://account.venmo.com/u/solidstatedepot', icon: 'venmo' },
] as const
