import {
  Payment20Regular,
  People20Regular,
  Person20Regular,
  Shield20Regular,
} from '@fluentui/react-icons'
import { type UserStatus } from './schema'

export const callTypes = new Map<
  UserStatus,
  'success' | 'subtle' | 'informative' | 'danger'
>([
  ['active', 'success'],
  ['inactive', 'subtle'],
  ['invited', 'informative'],
  ['suspended', 'danger'],
])

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
