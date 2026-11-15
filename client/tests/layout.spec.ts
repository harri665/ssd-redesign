import { expect, test } from '@playwright/test'
import { PAGES, open } from './helpers'

for (const { path, name } of PAGES) {
  test.describe(`${name} layout`, () => {
    test('reflows at 320 px wide without scrolling sideways', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 640 })
      await open(page, path)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow).toBeLessThanOrEqual(0)
    })

    test('works at 200 percent text size', async ({ page }) => {
      await page.setViewportSize({ width: 683, height: 450 })
      await open(page, path)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow).toBeLessThanOrEqual(0)
    })

    test('keeps working with larger text spacing', async ({ page }) => {
      await open(page, path)
      await page.addStyleTag({
        content: '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }',
      })
      const clipped = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>('main a, main button, main h1, main h2, main h3, main p')]
          .filter((el) => el.offsetParent !== null && !el.classList.contains('visually-hidden') && el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow === 'hidden')
          .map((el) => el.outerHTML.slice(0, 80)),
      )
      expect(clipped).toEqual([])
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow).toBeLessThanOrEqual(0)
    })

    test('buttons and links are at least 24 by 24 pixels', async ({ page }) => {
      await open(page, path)
      const small = await page.locator('button:visible, .pill-button:visible, .join-button:visible, .social a:visible, .shop-more:visible').evaluateAll((els) =>
        els
          .map((el) => ({ html: el.outerHTML.slice(0, 80), box: el.getBoundingClientRect() }))
          .filter(({ box }) => box.width < 24 || box.height < 24)
          .map(({ html, box }) => `${Math.round(box.width)}x${Math.round(box.height)} ${html}`),
      )
      expect(small).toEqual([])
    })
  })
}

test('the page still makes sense with CSS turned off', async ({ page }) => {
  await open(page, '/')
  const order = await page.evaluate(() => {
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach((el) => el.remove())
    return [...document.querySelectorAll('h1, h2')].map((el) => el.textContent?.trim())
  })
  expect(order[0]).toBe('Tour the Makerspace!')
  expect(order).toContain('See the Latest at the SSD')
})

test('motion is turned off when the user asks for reduced motion', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await context.newPage()
  await open(page, '/')
  const duration = await page.locator('.main-nav .arrow').first().evaluate((el) => getComputedStyle(el).transitionDuration)
  expect(duration).toBe('0s')
  await context.close()
})
