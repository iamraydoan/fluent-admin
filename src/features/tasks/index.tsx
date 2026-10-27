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
  // List full-height chain (see tasks-table): the page itself must
  // never scroll — only the table body scrolls. So this content
  // column is overflow hidden (not auto), and the card below fills
  // exactly the remaining viewport height after the header block.
  content: {
    flex: '1',
    minHeight: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  // Same pattern as the MES MainCard: the card is a flex column that
  // fills its parent, so the table inside can flex and scroll while
  // the pagination footer stays pinned at the card bottom.
  card: {
    flex: '1 1 auto',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  cardBody: {
    flex: '1 1 auto',
    minHeight: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
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
      search: {
        page: 1,
        pageSize: 25,
        status: [],
        priority: [],
        filter: '',
        title: '',
      },
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
          className={styles.card}
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
