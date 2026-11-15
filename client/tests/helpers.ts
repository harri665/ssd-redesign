import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'

export const PAGES = [
  { path: '/', name: 'Home', title: /Solid State Depot/ },
  { path: '/calendar', name: 'Calendar', title: /^Calendar \| Solid State Depot$/ },
  { path: '/join', name: 'Join', title: /^Join SSD \| Solid State Depot$/ },
  { path: '/no-such-page', name: 'Not found', title: /^Page not found \| Solid State Depot$/ },
] as const

export const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

export async function open(page: Page, path: string) {
  await page.route(/calendar\.google\.com/, (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><html lang="en"><title>Calendar</title><p>Calendar</p></html>' }))
  await page.goto(path)
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)
}

export function axe(page: Page) {
  return new AxeBuilder({ page }).withTags(WCAG_TAGS).exclude('.calendar-frame')
}

export function formatViolations(violations: { id: string; help: string; nodes: { target: unknown }[] }[]) {
  return violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => JSON.stringify(n.target)).join(', ')})`).join('\n')
}

export async function focused(page: Page) {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null
    if (!el) return ''
    const name = el.getAttribute('aria-label') ?? el.textContent ?? ''
    return `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''} ${name.trim().replace(/\s+/g, ' ')}`
  })
}
