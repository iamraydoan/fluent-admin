import { describe, expect, it } from 'vitest'
import {
  formatCurrency,
  formatDelta,
  formatNumber,
  formatPhone,
} from './format'

describe('formatNumber', () => {
  it('groups thousands', () => {
    expect(formatNumber(2350)).toBe('2,350')
    expect(formatNumber(12234)).toBe('12,234')
    expect(formatNumber(573)).toBe('573')
  })
})

describe('formatCurrency', () => {
  it('formats USD with two fraction digits', () => {
    expect(formatCurrency(45231.89)).toBe('$45,231.89')
    expect(formatCurrency(39)).toBe('$39.00')
  })
})

describe('formatDelta', () => {
  it('adds "+" only for positive deltas', () => {
    expect(formatDelta(20.1, '%')).toBe('+20.1%')
    expect(formatDelta(201)).toBe('+201')
    expect(formatDelta(-5)).toBe('-5')
    expect(formatDelta(0)).toBe('0')
  })
})

describe('formatPhone', () => {
  it('formats US numbers as +1 (AAA) BBB-CCCC', () => {
    expect(formatPhone('+17593407614')).toBe('+1 (759) 340-7614')
    expect(formatPhone('759-340-7614')).toBe('+1 (759) 340-7614')
    expect(formatPhone('+1 (759) 340-7614')).toBe('+1 (759) 340-7614')
  })

  it('keeps non-US and unparseable input unchanged', () => {
    expect(formatPhone('+44 20 7946 0958')).toBe('+44 20 7946 0958')
    expect(formatPhone('not a phone')).toBe('not a phone')
  })
})
