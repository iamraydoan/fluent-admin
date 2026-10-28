import { createFileRoute } from '@tanstack/react-router'
import { Rbac } from '@/features/rbac'

export const Route = createFileRoute('/_authenticated/rbac/')({
  component: Rbac,
})
