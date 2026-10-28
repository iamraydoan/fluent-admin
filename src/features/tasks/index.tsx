import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import {
  Add24Regular,
  ArrowClockwise24Regular,
  ArrowDownload24Regular,
  Delete24Regular,
} from '@fluentui/react-icons'
import { Card } from '@/components/ui/card'
import ActionBar from '@/components/layout/action-bar'
import PageTop from '@/components/layout/page-top'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksProvider, useTasks } from './components/tasks-provider'
import { TasksTable } from './components/tasks-table'
import { tasks } from './data/tasks'

const route = getRouteApi('/_authenticated/tasks/')

const useStyles = makeStyles({
  // List full-height chain (see tasks-table): the page itself must
  // never scroll — only the table body scrolls. So this content
  // column is overflow hidden (not auto), and the card below fills
  // exactly the remaining viewport height after the page top.
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
    gap: tokens.spacingVerticalL,
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
  },
})

function TasksScreen() {
  const styles = useStyles()
  const { setOpen, requestBulkDelete } = useTasks()
  const navigate = route.useNavigate()
  // Bumped on action bar Refresh so the table remounts (local sorting /
  // selection / column visibility reset) together with the URL
  // filter reset below.
  const [refreshKey, setRefreshKey] = useState(0)
  // Lifted from TasksTable via onSelectionChange: drives the
  // ActionBar Delete disabled state (0 = disabled, >0 = enabled).
  // The count resets on Refresh because the table remounts.
  const [selectedCount, setSelectedCount] = useState(0)

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
      <PageTop
        title='Tasks'
        actionBar={
          <ActionBar
            groups={[
              {
                label: 'General',
                actions: [
                  {
                    label: 'Refresh',
                    icon: <ArrowClockwise24Regular />,
                    onClick: handleRefresh,
                  },
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
                  {
                    label: 'Delete',
                    icon: <Delete24Regular />,
                    // Real state-driven disabled: no selection, no
                    // Delete. With a selection this requests the
                    // existing multi-delete flow via the provider
                    // flag (see DataTableBulkActions); it is not a
                    // new dialog and does not fake a delete.
                    disabled: selectedCount === 0,
                    onClick: requestBulkDelete,
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
            borderRadius: tokens.borderRadiusMedium,
            boxShadow: tokens.shadow2,
          }}
        >
          <div className={styles.cardBody}>
            <TasksTable
              key={refreshKey}
              data={tasks}
              onSelectionChange={setSelectedCount}
            />
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
