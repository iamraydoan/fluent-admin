import { Add20Regular, ArrowDownload20Regular } from '@fluentui/react-icons'
import { Button } from '@/components/ui/button'
import { useTasks } from './tasks-provider'

export function TasksPrimaryButtons() {
  const { setOpen } = useTasks()
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button
        appearance='outline'
        icon={<ArrowDownload20Regular />}
        onClick={() => setOpen('import')}
      >
        Import
      </Button>
      <Button
        appearance='primary'
        icon={<Add20Regular />}
        onClick={() => setOpen('create')}
      >
        Create
      </Button>
    </div>
  )
}
