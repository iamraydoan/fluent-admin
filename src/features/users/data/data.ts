import {
  Payment20Regular,
  People20Regular,
  Person20Regular,
  Shield20Regular,
} from '@fluentui/react-icons'
import { type UserStatus } from './schema'

export const callTypes = new Map<
  UserStatus,
  'success' | 'subtle' | 'informative' | 'danger' | 'severe' | 'warning'
>([
  ['active', 'success'],
  ['inactive', 'subtle'],
  ['invited', 'informative'],
  ['suspended', 'danger'],
  ['locked', 'severe'],
  ['expired', 'warning'],
])

export const departments = [
  { label: 'Engineering', value: 'Engineering' },
  { label: 'Sales', value: 'Sales' },
  { label: 'Operations', value: 'Operations' },
  { label: 'Finance', value: 'Finance' },
  { label: 'Support', value: 'Support' },
  { label: 'Human Resources', value: 'Human Resources' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'Product', value: 'Product' },
] as const

export const accountTypes = [
  { label: 'Internal', value: 'internal' },
  { label: 'External', value: 'external' },
  { label: 'Service', value: 'service' },
] as const

export const roles = [
  {
    label: 'Superadmin',
    value: 'superadmin',
    icon: Shield20Regular,
  },
  {
    label: 'Admin',
    value: 'admin',
    icon: Person20Regular,
  },
  {
    label: 'Manager',
    value: 'manager',
    icon: People20Regular,
  },
  {
    label: 'Cashier',
    value: 'cashier',
    icon: Payment20Regular,
  },
] as const
