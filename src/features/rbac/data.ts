// Permission matrix data. Mock configuration only: the matrix below
// is the initial local state for the RBAC screen, not permissions
// enforced by any server.

export const rbacRoles = [
  { label: 'Superadmin', value: 'superadmin' },
  { label: 'Admin', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'Cashier', value: 'cashier' },
] as const

export type RbacRole = (typeof rbacRoles)[number]['value']

export const rbacModules = [
  'Dashboard',
  'Tasks',
  'Users',
  'Apps',
  'Settings',
  'RBAC',
  'Audit Log',
] as const

export type RbacModule = (typeof rbacModules)[number]

export const rbacPermissions = [
  'Create',
  'Read',
  'Update',
  'Delete',
  'Export',
] as const

export type RbacPermission = (typeof rbacPermissions)[number]

export type RbacMatrix = Record<
  RbacRole,
  Record<RbacModule, Record<RbacPermission, boolean>>
>

function all(value: boolean): Record<RbacPermission, boolean> {
  return {
    Create: value,
    Read: value,
    Update: value,
    Delete: value,
    Export: value,
  }
}

function pick(...granted: RbacPermission[]): Record<RbacPermission, boolean> {
  return {
    Create: granted.includes('Create'),
    Read: granted.includes('Read'),
    Update: granted.includes('Update'),
    Delete: granted.includes('Delete'),
    Export: granted.includes('Export'),
  }
}

const none = pick()

export const initialRbacMatrix: RbacMatrix = {
  superadmin: {
    Dashboard: all(true),
    Tasks: all(true),
    Users: all(true),
    Apps: all(true),
    Settings: all(true),
    RBAC: all(true),
    'Audit Log': all(true),
  },
  admin: {
    Dashboard: pick('Read'),
    Tasks: all(true),
    Users: pick('Create', 'Read', 'Update'),
    Apps: pick('Read'),
    Settings: pick('Read', 'Update'),
    RBAC: pick('Read'),
    'Audit Log': pick('Read', 'Export'),
  },
  manager: {
    Dashboard: pick('Read'),
    Tasks: pick('Read', 'Update'),
    Users: pick('Read'),
    Apps: pick('Read'),
    Settings: pick('Read'),
    RBAC: none,
    'Audit Log': pick('Read'),
  },
  cashier: {
    Dashboard: pick('Read'),
    Tasks: pick('Read'),
    Users: none,
    Apps: pick('Read'),
    Settings: none,
    RBAC: none,
    'Audit Log': none,
  },
}
