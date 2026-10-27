import { createFileRoute } from '@tanstack/react-router'
import { MesAgentPage } from '@/features/mes-agent'

export const Route = createFileRoute('/_authenticated/mes-agent/')({
  component: MesAgentPage,
})
