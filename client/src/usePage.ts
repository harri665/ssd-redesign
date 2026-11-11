import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

let lastPath: string | null = null

export function usePage(title: string) {
  const h1Ref = useRef<HTMLHeadingElement>(null)
  const { pathname, hash } = useLocation()
  useEffect(() => {
    document.title = title
    if (lastPath !== null && lastPath !== pathname && !hash) h1Ref.current?.focus()
    lastPath = pathname
  }, [title, pathname, hash])
  return h1Ref
}
