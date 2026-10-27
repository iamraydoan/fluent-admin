import { createFileRoute } from '@tanstack/react-router'
import { ScreenLayout } from '@/components/layout/screen-layout'

export const Route = createFileRoute('/clerk/_authenticated')({
  component: ScreenLayout,
})
