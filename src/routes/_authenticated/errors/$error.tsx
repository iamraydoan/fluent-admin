import { createFileRoute } from '@tanstack/react-router'
import { makeStyles } from '@fluentui/react-components'
import { Card } from '@/components/ui/card'
import HeaderBlock from '@/components/layout/header-block'
import { ForbiddenError } from '@/features/errors/forbidden'
import { GeneralError } from '@/features/errors/general-error'
import { MaintenanceError } from '@/features/errors/maintenance-error'
import { NotFoundError } from '@/features/errors/not-found-error'
import { UnauthorisedError } from '@/features/errors/unauthorized-error'

export const Route = createFileRoute('/_authenticated/errors/$error')({
  component: RouteComponent,
})

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100%',
    minHeight: 0,
    flexDirection: 'column',
    gap: '8px',
  },
  card: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
  },
})

// In-app error screens (inside the authenticated shell). The standalone
// error routes under (errors)/ and the error components themselves are
// untouched: only this shell route gets the unified HeaderBlock. The
// error screens keep their own Go Back / Back to Home buttons, so no
// ribbon row is rendered.
const ERROR_TITLES: Record<string, string> = {
  unauthorized: 'Unauthorized',
  forbidden: 'Forbidden',
  'not-found': 'Not Found',
  'internal-server-error': 'Internal Server Error',
  'maintenance-error': 'Maintenance',
}

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  const styles = useStyles()
  const { error } = Route.useParams()

  const errorMap: Record<string, React.ComponentType> = {
    unauthorized: UnauthorisedError,
    forbidden: ForbiddenError,
    'not-found': NotFoundError,
    'internal-server-error': GeneralError,
    'maintenance-error': MaintenanceError,
  }
  const ErrorComponent = errorMap[error] || NotFoundError

  return (
    <div className={styles.root}>
      <HeaderBlock
        title={ERROR_TITLES[error] ?? 'Not Found'}
        ribbon={undefined}
      />
      <Card
        className={styles.card}
        style={{
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
        }}
      >
        <ErrorComponent />
      </Card>
    </div>
  )
}
