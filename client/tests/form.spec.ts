import { expect, test, type Page } from '@playwright/test'
import { open } from './helpers'

const send = (page: Page) => page.getByRole('button', { name: 'Send my visit plan' }).click()

test.beforeEach(async ({ page }) => {
  await open(page, '/join')
})

test('every field has a label', async ({ page }) => {
  for (const label of ['Your name', 'Email address', 'Phone number', 'Is there anything we can do to make your visit easier?']) {
    await expect(page.getByLabel(label, { exact: false }).first()).toBeVisible()
  }
  await expect(page.getByRole('group', { name: /Which membership/ })).toBeVisible()
  await expect(page.getByRole('group', { name: /Which shops/ })).toBeVisible()
})

test('fields use the right input types and autocomplete', async ({ page }) => {
  await expect(page.locator('#name')).toHaveAttribute('autocomplete', 'name')
  await expect(page.locator('#email')).toHaveAttribute('type', 'email')
  await expect(page.locator('#email')).toHaveAttribute('autocomplete', 'email')
  await expect(page.locator('#phone')).toHaveAttribute('type', 'tel')
  await expect(page.locator('#phone')).toHaveAttribute('autocomplete', 'tel')
})

test('required fields say they are required in text and in code', async ({ page }) => {
  await expect(page.locator('#name')).toHaveAttribute('required', '')
  await expect(page.locator('#email')).toHaveAttribute('required', '')
  await expect(page.locator('label[for="name"]')).toContainText('required')
  await expect(page.locator('label[for="email"]')).toContainText('required')
})

test('hints are connected to their fields', async ({ page }) => {
  await expect(page.locator('#email')).toHaveAccessibleDescription(/only use this to reply/)
  await expect(page.locator('#phone')).toHaveAccessibleDescription(/10 digits/)
})

test('sending an empty form lists every problem and moves focus to the list', async ({ page }) => {
  await send(page)
  const summary = page.locator('#form-message')
  await expect(summary).toBeFocused()
  await expect(summary.getByRole('heading')).toHaveText('There are 3 problems with the form')
  await expect(summary.getByRole('link')).toHaveText(['Enter your name', 'Enter your email address', "Choose a membership or pick I'm not sure yet"])
})

test('fields with problems are marked invalid and the error is read with the field', async ({ page }) => {
  await send(page)
  await expect(page.locator('#name')).toHaveAttribute('aria-invalid', 'true')
  await expect(page.locator('#name')).toHaveAccessibleDescription('Enter your name')
  await expect(page.locator('#email')).toHaveAttribute('aria-invalid', 'true')
  await expect(page.locator('#m-regular')).toHaveAttribute('aria-invalid', 'true')
  await expect(page.locator('#phone')).not.toHaveAttribute('aria-invalid', 'true')
})

test('links in the error list move focus to the field', async ({ page }) => {
  await send(page)
  await page.getByRole('link', { name: 'Enter your email address' }).click()
  await expect(page.locator('#email')).toBeFocused()
  await page.getByRole('link', { name: /Choose a membership/ }).click()
  await expect(page.locator('#m-regular')).toBeFocused()
})

test('a bad email and phone number get specific messages', async ({ page }) => {
  await page.locator('#name').fill('Nina Castillo')
  await page.locator('#email').fill('nina-at-example')
  await page.locator('#phone').fill('12345')
  await page.getByLabel('Regular, $85 a month').check()
  await send(page)
  await expect(page.locator('#email-error')).toHaveText('Enter an email address like name@example.com')
  await expect(page.locator('#phone-error')).toHaveText(/10 digit phone number/)
  await expect(page.locator('#form-message h2')).toHaveText('There are 2 problems with the form')
})

test('errors do not show until the form is sent', async ({ page }) => {
  await page.locator('#name').focus()
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await expect(page.locator('.error:not(:empty)')).toHaveCount(0)
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0)
})

test('a good form shows a success message and clears the fields', async ({ page }) => {
  await page.locator('#name').fill('Nina Castillo')
  await page.locator('#email').fill('nina@example.com')
  await page.locator('#phone').fill('303-555-0123')
  await page.getByLabel("I'm not sure yet").check()
  await page.getByLabel('Wood shop').check()
  await send(page)
  const message = page.locator('#form-message')
  await expect(message).toBeFocused()
  await expect(message.getByRole('heading')).toHaveText('Thanks, we will see you at the open house')
  await expect(page.locator('#name')).toHaveValue('')
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0)
})

test('the whole form can be filled in with only the keyboard', async ({ page }) => {
  await page.locator('#name').focus()
  await page.keyboard.type('Nina Castillo')
  await page.keyboard.press('Tab')
  await page.keyboard.type('nina@example.com')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Space')
  await expect(page.locator('#m-regular')).toBeChecked()
  await page.locator('#visit-form button[type="submit"]').focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('#form-message')).toHaveClass(/success/)
})
