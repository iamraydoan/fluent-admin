import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ErrorLayout } from './error-layout'

export function NotFoundError() {
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
    <ErrorLayout
      code='404'
      title='Oops! Page Not Found!'
      description={
        <>
          It seems like the page you&apos;re looking for <br />
          does not exist or might have been removed.
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
