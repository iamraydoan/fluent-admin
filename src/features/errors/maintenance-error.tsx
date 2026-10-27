import { Button } from '@/components/ui/button'
import { ErrorLayout } from './error-layout'

export function MaintenanceError() {
  return (
    <ErrorLayout
      code='503'
      title='Website is under maintenance!'
      description={
        <>
          The site is not available at the moment. <br />
          We&apos;ll be back online shortly.
        </>
      }
    >
      <Button appearance='outline'>Learn more</Button>
    </ErrorLayout>
  )
}
