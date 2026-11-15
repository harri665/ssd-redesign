import { expect, test } from '@playwright/test'
import { PAGES, open } from './helpers'

for (const { path, name, title } of PAGES) {
  test.describe(`${name} page structure`, () => {
    test.beforeEach(async ({ page }) => {
      await open(page, path)
    })

    test('has a descriptive title and English language', async ({ page }) => {
      await expect(page).toHaveTitle(title)
      await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    })

    test('has exactly one h1', async ({ page }) => {
      await expect(page.locator('h1')).toHaveCount(1)
    })

    test('does not skip heading levels', async ({ page }) => {
      const levels = await page
        .locator('h1, h2, h3, h4, h5, h6')
        .evaluateAll((els) => els.map((el) => Number(el.tagName[1])))
      expect(levels[0]).toBe(1)
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i] - levels[i - 1], `heading ${i} jumps from h${levels[i - 1]} to h${levels[i]}`).toBeLessThanOrEqual(1)
      }
    })

    test('has the main landmarks', async ({ page }) => {
      await expect(page.getByRole('banner')).toHaveCount(1)
      await expect(page.getByRole('main')).toHaveCount(1)
      await expect(page.getByRole('contentinfo')).toHaveCount(1)
      await expect(page.locator('nav#main-menu')).toHaveAttribute('aria-label', 'Main')
      await expect(page.locator('nav')).toHaveCount(await page.locator('nav[aria-label]').count())
    })

    test('every image has alt text and content images describe what they show', async ({ page }) => {
      const images = await page.locator('img').evaluateAll((els) =>
        els.map((el) => ({ src: el.getAttribute('src'), alt: el.getAttribute('alt') })),
      )
      for (const img of images) {
        expect(img.alt, `${img.src} needs alt text`).not.toBeNull()
        expect(img.alt!.trim().length, `${img.src} alt text is too short`).toBeGreaterThan(8)
        expect(img.alt, `${img.src} alt text should not say image or photo of`).not.toMatch(/^(image|photo|picture) of/i)
      }
    })

    test('every link and button has a name that makes sense on its own', async ({ page }) => {
      const vague = /^(read more|click here|more|here|link|learn more)$/i
      const controls = page.locator('a[href], button')
      const count = await controls.count()
      expect(count).toBeGreaterThan(5)
      for (let i = 0; i < count; i++) {
        const control = controls.nth(i)
        const html = await control.evaluate((el) => el.outerHTML.slice(0, 80))
        const name = await control.evaluate((el) => {
          const label = el.getAttribute('aria-label')
          if (label) return label
          const parts: string[] = []
          const walk = (node: Node) => {
            if (node.nodeType === Node.TEXT_NODE) parts.push(node.textContent ?? '')
            else if (node instanceof HTMLImageElement) parts.push(node.alt)
            else node.childNodes.forEach(walk)
          }
          walk(el)
          return parts.join(' ').trim().replace(/\s+/g, ' ')
        })
        expect(name.length, `no name on ${html}`).toBeGreaterThan(0)
        expect(name, `"${name}" does not say where it goes`).not.toMatch(vague)
      }
    })

    test('no element uses a positive tabindex', async ({ page }) => {
      const positive = await page.locator('[tabindex]').evaluateAll((els) =>
        els.filter((el) => Number(el.getAttribute('tabindex')) > 0).map((el) => el.outerHTML.slice(0, 80)),
      )
      expect(positive).toEqual([])
    })

    test('links that open a new tab say so', async ({ page }) => {
      const blank = await page.locator('a[target="_blank"]').evaluateAll((els) =>
        els.filter((el) => !/new tab|new window/i.test(el.textContent ?? '')).map((el) => el.outerHTML.slice(0, 80)),
      )
      expect(blank).toEqual([])
    })

    test('ids are unique', async ({ page }) => {
      const dupes = await page.evaluate(() => {
        const ids = [...document.querySelectorAll('[id]')].map((el) => el.id)
        return ids.filter((id, i) => ids.indexOf(id) !== i)
      })
      expect(dupes).toEqual([])
    })

    test('has a class project notice so it is not mistaken for the real site', async ({ page }) => {
      await expect(page.getByText('it is not the official site')).toBeVisible()
    })
  })
}

test('the calendar iframe has a title and a way to skip past it', async ({ page }) => {
  await open(page, '/calendar')
  await expect(page.locator('iframe')).toHaveAttribute('title', /Google Calendar/)
  await page.getByRole('link', { name: 'Skip past the calendar' }).click()
  await expect(page.locator('#after-calendar')).toBeFocused()
})

test('the regular events are listed as text and not only in the iframe', async ({ page }) => {
  await open(page, '/calendar')
  const events = page.locator('.event-list > li')
  await expect(events).toHaveCount(4)
  await expect(events.first().getByRole('heading', { level: 3 })).toHaveText('Makerspace Open House and Tours')
})

test('the dues table has a caption and header cells', async ({ page }) => {
  await open(page, '/join')
  const table = page.getByRole('table', { name: /membership dues/i })
  await expect(table).toBeVisible()
  await expect(table.getByRole('columnheader')).toHaveCount(2)
  await expect(table.getByRole('rowheader')).toHaveCount(3)
})

test('news posts use time elements with a machine readable date', async ({ page }) => {
  await open(page, '/')
  const times = page.locator('.post-card time')
  await expect(times).toHaveCount(9)
  for (const value of await times.evaluateAll((els) => els.map((el) => el.getAttribute('datetime')))) {
    expect(value).toMatch(/^\d{4}-\d{2}$/)
  }
})
