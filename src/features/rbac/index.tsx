import { useState } from 'react'
import { makeStyles, tokens } from '@fluentui/react-components'
import {
  ArrowClockwise24Regular,
  Checkmark24Regular,
} from '@fluentui/react-icons'
import { toast } from '@/lib/toast'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/table'
import { Text } from '@/components/ui/text'
import ActionBar from '@/components/layout/action-bar'
import PageTop from '@/components/layout/page-top'
import {
  initialRbacMatrix,
  rbacModules,
  rbacPermissions,
  rbacRoles,
  type RbacMatrix,
  type RbacModule,
  type RbacPermission,
  type RbacRole,
} from './data'

const useStyles = makeStyles({
  content: {
    flex: '1',
    minHeight: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
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
  tableWrap: {
    flex: '1',
    minHeight: 0,
    overflow: 'auto',
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  headerCell: {
    textTransform: 'uppercase',
    position: 'sticky',
    top: 0,
    backgroundColor: tokens.colorNeutralBackground3,
    zIndex: 1,
  },
  permissionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
})

export function Rbac() {
  const styles = useStyles()
  const [matrix, setMatrix] = useState<RbacMatrix>(initialRbacMatrix)

  const toggle = (
    role: RbacRole,
    module: RbacModule,
    permission: RbacPermission,
    checked: boolean
  ) => {
    setMatrix((current) => ({
      ...current,
      [role]: {
        ...current[role],
        [module]: {
          ...current[role][module],
          [permission]: checked,
        },
      },
    }))
  }

  const handleRefresh = () => {
    setMatrix(initialRbacMatrix)
  }

  const handleSave = () => {
    // Configuration UI only: the matrix lives in local state and is
    // not sent to a server. The toast confirms the local action.
    toast.success('Permissions updated (local configuration only)')
  }

  return (
    <>
      <PageTop
        title='RBAC'
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
                    label: 'Save',
                    icon: <Checkmark24Regular />,
                    onClick: handleSave,
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
            <Text>
              Roles ({rbacRoles.length}) — Configuration UI only: toggles update
              local state and are not saved to a server.
            </Text>
            <div className={styles.tableWrap}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell className={styles.headerCell}>
                      Role
                    </TableHeaderCell>
                    {rbacModules.map((module) => (
                      <TableHeaderCell
                        key={module}
                        className={styles.headerCell}
                      >
                        {module}
                      </TableHeaderCell>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rbacRoles.map((role) => (
                    <TableRow key={role.value}>
                      <TableCell>
                        <Text weight='semibold'>{role.label}</Text>
                      </TableCell>
                      {rbacModules.map((module) => (
                        <TableCell key={module}>
                          <div className={styles.permissionList}>
                            {rbacPermissions.map((permission) => (
                              <Checkbox
                                key={permission}
                                label={permission}
                                checked={matrix[role.value][module][permission]}
                                onChange={(_, data) =>
                                  toggle(
                                    role.value,
                                    module,
                                    permission,
                                    data.checked === true
                                  )
                                }
                                aria-label={`${role.label} ${module} ${permission}`}
                              />
                            ))}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
