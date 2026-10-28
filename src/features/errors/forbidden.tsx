import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ErrorLayout } from './error-layout'

export function ForbiddenError({
  variant,
}: {
  variant?: 'standalone' | 'in-shell'
}) {
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
    <ErrorLayout
      variant={variant}
      code='403'
      title='Access Forbidden'
      description={
        <>
          You don&apos;t have necessary permission <br />
          to view this resource.
        </>
      }
    >
      <Button appearance='outline' onClick={() => history.go(-1)}>
        Go Back
      </Button>
      <Button appearance='primary' onClick={() => navigate({ to: '/' })}>
        Back to Home
      </Button>
    </ErrorLayout>
  )
}
