import {
  ArrowDown20Regular,
  ArrowRight20Regular,
  ArrowUp20Regular,
  CheckmarkCircle20Regular,
  Circle20Regular,
  DismissCircle20Regular,
  ErrorCircle20Regular,
  QuestionCircle20Regular,
  Timer20Regular,
} from '@fluentui/react-icons'

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

// Status -> StatusBadge colour map, mirroring the Users callTypes map:
// done = success, canceled = danger, todo = informative,
// backlog = subtle (unstarted, quieter than todo), in progress = warning.
export const taskStatusColors = new Map<
  string,
  'success' | 'subtle' | 'informative' | 'danger' | 'severe' | 'warning'
>([
  ['backlog', 'subtle'],
  ['todo', 'informative'],
  ['in progress', 'warning'],
  ['done', 'success'],
  ['canceled', 'danger'],
])

export const statuses = [
  {
    label: 'Backlog',
    value: 'backlog' as const,
    icon: QuestionCircle20Regular,
  },
  {
    label: 'Todo',
    value: 'todo' as const,
    icon: Circle20Regular,
  },
  {
    label: 'In Progress',
    value: 'in progress' as const,
    icon: Timer20Regular,
  },
  {
    label: 'Done',
    value: 'done' as const,
    icon: CheckmarkCircle20Regular,
  },
  {
    label: 'Canceled',
    value: 'canceled' as const,
    icon: DismissCircle20Regular,
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'low' as const,
    icon: ArrowDown20Regular,
  },
  {
    label: 'Medium',
    value: 'medium' as const,
    icon: ArrowRight20Regular,
  },
  {
    label: 'High',
    value: 'high' as const,
    icon: ArrowUp20Regular,
  },
  {
    label: 'Critical',
    value: 'critical' as const,
    icon: ErrorCircle20Regular,
  },
]
