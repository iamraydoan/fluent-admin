import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, type RenderResult } from 'vitest-browser-react'
import { type Locator, userEvent } from 'vitest/browser'
import { toast } from '@/lib/toast'
import { OtpForm } from './otp-form'

const navigate = vi.fn()

vi.mock('@tanstack/react-router', async (orig) => {
  const actual = await orig<typeof import('@tanstack/react-router')>()
  return { ...actual, useNavigate: () => navigate }
})

vi.mock('@/lib/toast', () => ({ toast: { success: vi.fn() } }))

describe('OtpForm', () => {
  let screen: RenderResult
  let otpInput: Locator
  let verifyButton: Locator

  beforeEach(async () => {
    vi.clearAllMocks()

    screen = await render(<OtpForm />)
    otpInput = screen.getByLabelText(/^One-Time Password$/i)
    verifyButton = screen.getByRole('button', { name: /^Verify$/i })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('disables Verify until 6 digits are entered', async () => {
    await expect.element(verifyButton).toBeDisabled()

    await userEvent.fill(otpInput, '12345')
    await expect.element(verifyButton).toBeDisabled()

    await userEvent.fill(otpInput, '123456')
    await expect.element(verifyButton).toBeEnabled()
  })

  it('submits the OTP and navigates after timeout', async () => {
    vi.useFakeTimers()

    await userEvent.fill(otpInput, '123456')
    await userEvent.click(verifyButton)

    expect(toast.success).toHaveBeenCalledOnce()
    expect(toast.success).toHaveBeenCalledWith('Verification code submitted.')

    await vi.advanceTimersByTimeAsync(1000)
    expect(navigate).toHaveBeenCalledWith({ to: '/' })
  })
})
