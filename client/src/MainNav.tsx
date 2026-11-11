import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { MENU, isGroup, isParent, type MenuLink, type MenuParent } from './links.ts'

function ItemLink({ item }: { item: MenuLink }) {
  return item.to ? <NavLink to={item.to}>{item.label}</NavLink> : <a href={item.href}>{item.label}</a>
}

interface SubmenuProps {
  menu: MenuParent
  open: boolean
  onToggle: () => void
  onClose: () => void
}

function Submenu({ menu, open, onToggle, onClose }: SubmenuProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const onKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
    if (event.key === 'Escape' && open) {
      onClose()
      buttonRef.current?.focus()
    }
  }

  const onBlur = (event: FocusEvent<HTMLLIElement>) => {
    if (open && !event.currentTarget.contains(event.relatedTarget as Node | null)) onClose()
  }

  return (
    <li className="has-sub" onKeyDown={onKeyDown} onBlur={onBlur}>
      <button ref={buttonRef} type="button" aria-expanded={open} aria-controls={menu.id} onClick={onToggle}>
        {menu.label}
        <span className="arrow" aria-hidden="true" />
      </button>
      <ul className="submenu" id={menu.id} hidden={!open}>
        {menu.items.map((item) =>
          isGroup(item) ? (
            <li key={item.label} className="group">
              <span className="group-label">{item.label}</span>
              <ul>
                {item.items.map((child) => (
                  <li key={child.label}>
                    <ItemLink item={child} />
                  </li>
                ))}
              </ul>
            </li>
          ) : (
            <li key={item.label}>
              <ItemLink item={item} />
            </li>
          ),
        )}
      </ul>
    </li>
  )
}

interface MainNavProps {
  open: boolean
  onClose: () => void
}

export default function MainNav({ open, onClose }: MainNavProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const { pathname } = useLocation()

  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setOpenId(null)
  }

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenId(null)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <nav
      className="main-nav"
      id="main-menu"
      aria-label="Main"
      ref={navRef}
      data-open={open}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open && openId === null) onClose()
      }}
    >
      <ul>
        {MENU.map((menu) =>
          isParent(menu) ? (
            <Submenu
              key={menu.id}
              menu={menu}
              open={openId === menu.id}
              onToggle={() => setOpenId(openId === menu.id ? null : menu.id)}
              onClose={() => setOpenId(null)}
            />
          ) : (
            <li key={menu.label}>
              <ItemLink item={menu} />
            </li>
          ),
        )}
      </ul>
    </nav>
  )
}
