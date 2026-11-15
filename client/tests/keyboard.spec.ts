import { expect, test } from '@playwright/test'
import { PAGES, focused, open } from './helpers'

for (const { path, name } of PAGES) {
  test(`${name}: the first Tab goes to a skip link that moves focus to main`, async ({ page }) => {
    await open(page, path)
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: 'Skip to main content' })
    await expect(skip).toBeFocused()
    await expect(skip).toBeInViewport()
    await page.keyboard.press('Enter')
    await expect(page.locator('main#main')).toBeFocused()
  })

  test(`${name}: every focusable element shows a visible focus outline`, async ({ page, isMobile }) => {
    test.skip(isMobile, 'Tab order is checked at desktop width')
    await open(page, path)
    const seen = new Set<string>()
    for (let i = 0; i < 60; i++) {
      await page.keyboard.press('Tab')
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement
        if (el === document.body) return null
        const s = getComputedStyle(el)
        return {
          key: el.outerHTML.slice(0, 120),
          outline: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2,
          shadow: s.boxShadow !== 'none',
        }
      })
      if (!info || seen.has(info.key)) break
      seen.add(info.key)
      expect(info.outline || info.shadow, `no focus outline on ${info.key}`).toBe(true)
    }
    expect(seen.size).toBeGreaterThan(5)
  })
}

test.describe('main menu', () => {
  test.beforeEach(async ({ page, isMobile }) => {
    await open(page, '/')
    if (isMobile) await page.getByRole('button', { name: 'Menu' }).click()
  })

  for (const [label, id, first] of [
    ['About', 'sub-about', 'Our Makerspace'],
    ['Contact', 'sub-contact', 'Slack Channel'],
    ['Members', 'sub-members', 'Login'],
  ] as const) {
    test(`${label} opens with Enter and closes with Escape`, async ({ page }) => {
      const button = page.getByRole('button', { name: label, exact: true })
      await expect(button).toHaveAttribute('aria-expanded', 'false')
      await expect(button).toHaveAttribute('aria-controls', id)
      await expect(page.locator(`#${id}`)).toBeHidden()

      await button.focus()
      await page.keyboard.press('Enter')
      await expect(button).toHaveAttribute('aria-expanded', 'true')
      await expect(page.locator(`#${id}`)).toBeVisible()

      await page.keyboard.press('Tab')
      expect(await focused(page)).toContain(first)

      await page.keyboard.press('Escape')
      await expect(button).toHaveAttribute('aria-expanded', 'false')
      await expect(button).toBeFocused()
    })

    test(`${label} opens with Space`, async ({ page }) => {
      const button = page.getByRole('button', { name: label, exact: true })
      await button.focus()
      await page.keyboard.press('Space')
      await expect(button).toHaveAttribute('aria-expanded', 'true')
    })
  }

  test('a submenu closes when focus leaves it', async ({ page }) => {
    const about = page.getByRole('button', { name: 'About', exact: true })
    await about.focus()
    await page.keyboard.press('Enter')
    const links = await page.locator('#sub-about a').count()
    for (let i = 0; i <= links; i++) await page.keyboard.press('Tab')
    await expect(about).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator('#sub-about')).toBeHidden()
  })

  test('a submenu closes when you click somewhere else', async ({ page }) => {
    await page.getByRole('button', { name: 'Members', exact: true }).click()
    await expect(page.locator('#sub-members')).toBeVisible()
    await page.locator('main').click({ position: { x: 5, y: 5 } })
    await expect(page.locator('#sub-members')).toBeHidden()
  })

  test('opening one submenu closes the other', async ({ page }) => {
    await page.getByRole('button', { name: 'About', exact: true }).click()
    await page.getByRole('button', { name: 'Contact', exact: true }).click()
    await expect(page.locator('#sub-about')).toBeHidden()
    await expect(page.locator('#sub-contact')).toBeVisible()
  })

  test('the menu is not opened by hover alone', async ({ page, isMobile }) => {
    test.skip(isMobile, 'no hover on phones')
    await page.getByRole('button', { name: 'About', exact: true }).hover()
    await expect(page.locator('#sub-about')).toBeHidden()
  })
})

test.describe('phone menu', () => {
  test.beforeEach(async ({ isMobile }) => {
    test.skip(!isMobile, 'the Menu button only shows on small screens')
  })

  test('the Menu button shows and hides the menu and reports its state', async ({ page }) => {
    await open(page, '/')
    const toggle = page.getByRole('button', { name: 'Menu' })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator('#main-menu')).toBeHidden()
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('#main-menu')).toBeVisible()
    await toggle.click()
    await expect(page.locator('#main-menu')).toBeHidden()
  })

  test('Escape closes the open menu', async ({ page }) => {
    await open(page, '/')
    await page.getByRole('button', { name: 'Menu' }).click()
    await page.getByRole('link', { name: 'Donate', exact: true }).focus()
    await page.keyboard.press('Escape')
    await expect(page.locator('#main-menu')).toBeHidden()
  })

  test('the menu closes after going to a new page', async ({ page }) => {
    await open(page, '/')
    await page.getByRole('button', { name: 'Menu' }).click()
    await page.getByRole('link', { name: 'Calendar', exact: true }).click()
    await expect(page).toHaveURL(/\/calendar$/)
    await expect(page.locator('#main-menu')).toBeHidden()
  })
})

test.describe('search', () => {
  test('the search button opens a labelled search box and puts focus in it', async ({ page }) => {
    await open(page, '/')
    const button = page.locator('button[aria-controls="site-search"]')
    await expect(button).toHaveAccessibleName('Search')
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await button.click()
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByRole('search')).toBeVisible()
    const input = page.locator('#search-input')
    await expect(input).toHaveAccessibleName('Search the SSD website')
    await expect(input).toBeFocused()
  })

  test('Escape closes the search box', async ({ page }) => {
    await open(page, '/')
    await page.getByRole('button', { name: 'Search' }).click()
    await page.keyboard.press('Escape')
    await expect(page.locator('#site-search')).toBeHidden()
  })

  test('the search form sends the words to the real site', async ({ page }) => {
    await open(page, '/')
    await page.getByRole('button', { name: 'Search' }).click()
    const form = page.getByRole('search')
    await expect(form).toHaveAttribute('action', 'https://www.ssdmakerspace.org/')
    await expect(form.locator('input')).toHaveAttribute('name', 's')
  })
})

test.describe('page changes', () => {
  test('going to a new page moves focus to its h1 and updates the title', async ({ page, isMobile }) => {
    await open(page, '/')
    if (isMobile) await page.getByRole('button', { name: 'Menu' }).click()
    await page.getByRole('link', { name: 'Calendar', exact: true }).click()
    await expect(page).toHaveURL(/\/calendar$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Calendar' })).toBeFocused()
    await expect(page).toHaveTitle('Calendar | Solid State Depot')
  })

  test('the current page is marked with aria-current', async ({ page }) => {
    await open(page, '/calendar')
    await expect(page.locator('.main-nav a[aria-current="page"]')).toHaveText('Calendar')
    await open(page, '/join')
    await expect(page.locator('.join-button')).toHaveAttribute('aria-current', 'page')
  })

  test('the first page load does not steal focus from the skip link', async ({ page }) => {
    await open(page, '/join')
    await expect(page.locator('h1')).not.toBeFocused()
  })
})

test.describe('hero photos', () => {
  test('the photo buttons have names and show which photo is on', async ({ page }) => {
    await open(page, '/')
    const dots = page.getByRole('button', { name: /^Photo \d of 3$/ })
    await expect(dots).toHaveCount(3)
    await expect(dots.nth(0)).toHaveAttribute('aria-pressed', 'true')
    await dots.nth(2).focus()
    await page.keyboard.press('Enter')
    await expect(dots.nth(2)).toHaveAttribute('aria-pressed', 'true')
    await expect(dots.nth(0)).toHaveAttribute('aria-pressed', 'false')
    await expect(page.locator('.hero-photos img:not([hidden])')).toHaveAttribute('src', /hero-3/)
  })

  test('the photos do not change on their own', async ({ page }) => {
    await open(page, '/')
    const shown = page.locator('.hero-photos img:not([hidden])')
    const first = await shown.getAttribute('src')
    await page.waitForTimeout(7000)
    await expect(shown).toHaveAttribute('src', first!)
  })
})
