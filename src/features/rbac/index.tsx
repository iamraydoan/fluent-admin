import { useState } from 'react'
import { makeStyles, tokens } from '@fluentui/react-components'
import {
  ArrowClockwise24Regular,
  Checkmark24Regular,
} from '@fluentui/react-icons'
import { toast } from '@/lib/toast'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
} from '@/components/ui/dialog'
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
    borderRadius: tokens.borderRadiusXLarge,
  },
  headerCell: {
    textTransform: 'uppercase',
    position: 'sticky',
    top: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    zIndex: 1,
  },
  permissionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  headerToggle: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    textTransform: 'none',
  },
  rowToggle: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
})

function matrixEquals(a: RbacMatrix, b: RbacMatrix): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function Rbac() {
  const styles = useStyles()
  const [matrix, setMatrix] = useState<RbacMatrix>(initialRbacMatrix)
  const [confirmRefreshOpen, setConfirmRefreshOpen] = useState(false)

  const isDirty = !matrixEquals(matrix, initialRbacMatrix)

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

  // Toggle-all UX (documented choice): a toggle-all checkbox is
  // checked only when every permission it covers is checked. For a
  // partial selection it shows Fluent's indeterminate ("mixed")
  // state, never a misleading checked state. Clicking a mixed
  // checkbox grants all (Fluent reports checked=true); clicking a
  // checked one revokes all; clicking an unchecked one grants all.
  // Levels: per-cell "All" (1 role x 1 module), per-role row "All"
  // (all 7 modules of one role), per-module column "All" (one module
  // for all 4 roles, in the column header cell).
  const toggleAll = (role: RbacRole, module: RbacModule, checked: boolean) => {
    setMatrix((current) => ({
      ...current,
      [role]: {
        ...current[role],
        [module]: Object.fromEntries(
          rbacPermissions.map((permission) => [permission, checked])
        ) as Record<RbacPermission, boolean>,
      },
    }))
  }

  const toggleRow = (role: RbacRole, checked: boolean) => {
    setMatrix((current) => ({
      ...current,
      [role]: Object.fromEntries(
        rbacModules.map((module) => [
          module,
          Object.fromEntries(
            rbacPermissions.map((permission) => [permission, checked])
          ),
        ])
      ) as Record<RbacModule, Record<RbacPermission, boolean>>,
    }))
  }

  const toggleColumn = (module: RbacModule, checked: boolean) => {
    setMatrix(
      (current) =>
        Object.fromEntries(
          rbacRoles.map(({ value }) => [
            value,
            {
              ...current[value],
              [module]: Object.fromEntries(
                rbacPermissions.map((permission) => [permission, checked])
              ),
            },
          ])
        ) as RbacMatrix
    )
  }

  // Returns true (all), 'mixed' (some), or false (none) for a set of
  // permission values, for direct use as Fluent Checkbox `checked`.
  const toggleState = (values: boolean[]): boolean | 'mixed' =>
    values.every(Boolean) ? true : values.some(Boolean) ? 'mixed' : false

  const handleRefreshClick = () => {
    if (isDirty) {
      setConfirmRefreshOpen(true)
    } else {
      setMatrix(initialRbacMatrix)
    }
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
                    onClick: handleRefreshClick,
                  },
                  {
                    label: 'Save',
                    icon: <Checkmark24Regular />,
                    onClick: handleSave,
                    disabled: !isDirty,
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
            borderRadius: tokens.borderRadiusXLarge,
            boxShadow: tokens.shadow2,
          }}
        >
          <div className={styles.cardBody}>
            <Text>
              Roles ({rbacRoles.length}) — Configuration UI only: toggles update
              local state and are not saved to a server. Tick &quot;All&quot; in
              a cell to toggle all permissions for that role and module,
              &quot;All&quot; beside a role name to toggle that whole role row,
              or &quot;All&quot; under a module name to toggle that whole module
              column. A partially selected toggle shows an indeterminate state.
              Save is disabled until the matrix changes; Refresh asks for
              confirmation when there are unsaved changes.
            </Text>
            <div className={styles.tableWrap}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell className={styles.headerCell}>
                      Role
                    </TableHeaderCell>
                    {rbacModules.map((module) => {
                      const columnValues = rbacRoles.flatMap(({ value }) =>
                        rbacPermissions.map(
                          (permission) => matrix[value][module][permission]
                        )
                      )
                      return (
                        <TableHeaderCell
                          key={module}
                          className={styles.headerCell}
                        >
                          <div className={styles.headerToggle}>
                            <span>{module}</span>
                            <Checkbox
                              label='All'
                              checked={toggleState(columnValues)}
                              onChange={(_, data) =>
                                toggleColumn(module, data.checked === true)
                              }
                              aria-label={`${module} all roles all permissions`}
                            />
                          </div>
                        </TableHeaderCell>
                      )
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rbacRoles.map((role) => {
                    const rowValues = rbacModules.flatMap((module) =>
                      rbacPermissions.map(
                        (permission) => matrix[role.value][module][permission]
                      )
                    )
                    return (
                      <TableRow key={role.value}>
                        <TableCell>
                          <div className={styles.rowToggle}>
                            <Text weight='semibold'>{role.label}</Text>
                            <Checkbox
                              label='All'
                              checked={toggleState(rowValues)}
                              onChange={(_, data) =>
                                toggleRow(role.value, data.checked === true)
                              }
                              aria-label={`${role.label} all modules all permissions`}
                            />
                          </div>
                        </TableCell>
                        {rbacModules.map((module) => {
                          const cell = matrix[role.value][module]
                          return (
                            <TableCell key={module}>
                              <div className={styles.permissionList}>
                                <Checkbox
                                  label='All'
                                  checked={toggleState(
                                    rbacPermissions.map(
                                      (permission) => cell[permission]
                                    )
                                  )}
                                  onChange={(_, data) =>
                                    toggleAll(
                                      role.value,
                                      module,
                                      data.checked === true
                                    )
                                  }
                                  aria-label={`${role.label} ${module} all permissions`}
                                />
                                {rbacPermissions.map((permission) => (
                                  <Checkbox
                                    key={permission}
                                    label={permission}
                                    checked={cell[permission]}
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
                          )
                        })}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </div>
      <Dialog
        open={confirmRefreshOpen}
        onOpenChange={(_, data) => setConfirmRefreshOpen(data.open)}
      >
        <DialogSurface>
          <DialogTitle>Discard unsaved changes?</DialogTitle>
          <DialogBody>
            <DialogContent>
              Refresh will discard your unsaved permission changes and restore
              the initial matrix.
            </DialogContent>
            <DialogActions>
              <Button
                appearance='secondary'
                onClick={() => setConfirmRefreshOpen(false)}
              >
                Cancel
              </Button>
              <Button
                appearance='primary'
                onClick={() => {
                  setMatrix(initialRbacMatrix)
                  setConfirmRefreshOpen(false)
                }}
              >
                Discard changes
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}
