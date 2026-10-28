// Audit log mock data only. These events are generated locally for
// display; they are not captured from a real audit system.

export const auditActions = [
  { label: 'Created', value: 'Created' },
  { label: 'Updated', value: 'Updated' },
  { label: 'Deleted', value: 'Deleted' },
  { label: 'Exported', value: 'Exported' },
] as const

export type AuditAction = (typeof auditActions)[number]['value']

export type AuditEvent = {
  id: string
  timestamp: Date
  actor: string
  action: AuditAction
  entity: string
  entityName: string
  summary: string
}

export const auditActors = [
  'Alex Smith',
  'Jane Smith',
  'John Doe',
  'Maria Garcia',
  'David Lee',
  'Sarah Chen',
] as const

export const auditEntities = [
  'Users',
  'Tasks',
  'RBAC',
  'Settings',
  'Apps',
] as const

const entityNames: Record<string, string[]> = {
  Users: ['alex_smith', 'john_doe', 'maria_garcia', 'david_lee'],
  Tasks: ['Quarterly report', 'Onboarding checklist', 'Inventory review'],
  RBAC: ['Manager role', 'Cashier role', 'Admin role'],
  Settings: ['Display settings', 'Notification settings'],
  Apps: ['Calendar', 'Messages', 'Files'],
}

function summaryFor(
  action: AuditAction,
  entity: string,
  index: number
): string {
  switch (action) {
    case 'Created':
      return `— → Status: Active`
    case 'Updated':
      return index % 2 === 0
        ? `Status: Active → Suspended`
        : `Role: Cashier → Manager`
    case 'Deleted':
      return `Status: Active → —`
    case 'Exported':
      return `— → Exported ${entity} records`
  }
}

const baseTime = Date.UTC(2026, 9, 26, 12, 0, 0)

export const auditEvents: AuditEvent[] = Array.from(
  { length: 80 },
  (_, index) => {
    const action = auditActions[index % auditActions.length].value
    const entity = auditEntities[index % auditEntities.length]
    const names = entityNames[entity]
    return {
      id: `audit-${index + 1}`,
      timestamp: new Date(baseTime - index * 7 * 60 * 60 * 1000),
      actor: auditActors[index % auditActors.length],
      action,
      entity,
      entityName: names[index % names.length],
      summary: summaryFor(action, entity, index),
    }
  }
)
