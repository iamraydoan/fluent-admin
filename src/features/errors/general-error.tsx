import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ErrorLayout } from './error-layout'

type GeneralErrorProps = React.HTMLAttributes<HTMLDivElement> & {
  minimal?: boolean
  variant?: 'standalone' | 'in-shell'
}

export function GeneralError({ minimal = false, variant }: GeneralErrorProps) {
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
    <ErrorLayout
      variant={variant}
      code={minimal ? undefined : '500'}
      title="Oops! Something went wrong :')"
      description={
        <>
          We apologize for the inconvenience. <br /> Please try again later.
        </>
      }
    >
      {!minimal && (
        <>
          <Button appearance='outline' onClick={() => history.go(-1)}>
            Go Back
          </Button>
          <Button appearance='primary' onClick={() => navigate({ to: '/' })}>
            Back to Home
          </Button>
        </>
      )}
    </ErrorLayout>
  )
}
