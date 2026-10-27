import { createFileRoute } from '@tanstack/react-router'
import { MesAgentPage } from '@/features/mes-agent'

export const Route = createFileRoute('/mes-agent')({
  component: MesAgentPage,
})
