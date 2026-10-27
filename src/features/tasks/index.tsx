import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { makeStyles } from '@fluentui/react-components'
import {
  Add24Regular,
  ArrowClockwise24Regular,
  ArrowDownload24Regular,
} from '@fluentui/react-icons'
import { Card } from '@/components/ui/card'
import HeaderBlock from '@/features/mes-agent/components/HeaderBlock'
import Ribbon from '@/features/mes-agent/components/Ribbon'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksProvider, useTasks } from './components/tasks-provider'
import { TasksTable } from './components/tasks-table'
import { tasks } from './data/tasks'

const route = getRouteApi('/_authenticated/tasks/')

const useStyles = makeStyles({
  content: {
    flex: '1',
    minHeight: 0,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
    minHeight: 0,
  },
})

function TasksScreen() {
  const styles = useStyles()
  const { setOpen } = useTasks()
  const navigate = route.useNavigate()
  // Bumped on ribbon Refresh so the table remounts (local sorting /
  // selection / column visibility reset) together with the URL
  // filter reset below.
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    navigate({
      search: { page: 1, pageSize: 10, status: [], priority: [], filter: '' },
    })
    setRefreshKey((key) => key + 1)
  }

  return (
    <>
      <HeaderBlock
        title='Tasks'
        ribbon={
          <Ribbon
            groups={[
              {
                label: 'General',
                actions: [
                  {
                    label: 'Refresh',
                    icon: <ArrowClockwise24Regular />,
                    onClick: handleRefresh,
                  },
                ],
              },
              {
                label: 'Actions',
                actions: [
                  {
                    label: 'Import',
                    icon: <ArrowDownload24Regular />,
                    onClick: () => setOpen('import'),
                  },
                  {
                    label: 'Create',
                    icon: <Add24Regular />,
                    onClick: () => setOpen('create'),
                  },
                ],
              },
            ]}
          />
        }
      />
      <div className={styles.content}>
        <Card
          style={{
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
          }}
        >
          <div className={styles.cardBody}>
            <TasksTable key={refreshKey} data={tasks} />
          </div>
        </Card>
      </div>
      <TasksDialogs />
    </>
  )
}

export function Tasks() {
  return (
    <TasksProvider>
      <TasksScreen />
    </TasksProvider>
  )
}
