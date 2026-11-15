import { expect, test } from '@playwright/test'
import { PAGES, axe, formatViolations, open } from './helpers'

for (const { path, name } of PAGES) {
  test.describe(`${name} page`, () => {
    test('has no WCAG 2.2 AA violations', async ({ page }) => {
      await open(page, path)
      const { violations } = await axe(page).analyze()
      expect(violations, formatViolations(violations)).toEqual([])
    })

    test('has no best practice violations', async ({ page }) => {
      await open(page, path)
      const { violations } = await axe(page).withTags(['best-practice']).analyze()
      expect(violations, formatViolations(violations)).toEqual([])
    })

    test('passes color contrast with the menus open', async ({ page, isMobile }) => {
      await open(page, path)
      if (isMobile) await page.getByRole('button', { name: 'Menu' }).click()
      for (const label of ['About', 'Contact', 'Members']) {
        await page.getByRole('button', { name: label, exact: true }).click()
        const { violations } = await axe(page).include('#main-menu').withRules(['color-contrast']).analyze()
        expect(violations, formatViolations(violations)).toEqual([])
      }
    })
  })
}

test('the form error state has no violations', async ({ page }) => {
  await open(page, '/join')
  await page.getByRole('button', { name: 'Send my visit plan' }).click()
  await expect(page.locator('.error-summary')).toBeVisible()
  const { violations } = await axe(page).analyze()
  expect(violations, formatViolations(violations)).toEqual([])
})

test('the search box has no violations when open', async ({ page }) => {
  await open(page, '/')
  await page.getByRole('button', { name: 'Search' }).click()
  const { violations } = await axe(page).include('#site-search').analyze()
  expect(violations, formatViolations(violations)).toEqual([])
})
