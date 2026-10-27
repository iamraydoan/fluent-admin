import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ErrorLayout } from './error-layout'

export function UnauthorisedError() {
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
    <ErrorLayout
      code='401'
      title='Unauthorized Access'
      description={
        <>
          Please log in with the appropriate credentials <br /> to access this
          resource.
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
