/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router'
import { SignIn } from '@clerk/react'
import { makeStyles } from '@fluentui/react-components'
import { Skeleton, SkeletonItem } from '@/components/ui/skeleton'

const useStyles = makeStyles({
  fallback: {
    width: '400px',
    height: '480px',
  },
})

export const Route = createFileRoute('/clerk/(auth)/sign-in')({
  component: ClerkSignIn,
})

function ClerkSignIn() {
  const styles = useStyles()
  return (
    <SignIn
      initialValues={{
        emailAddress: 'your_mail+shadcn_admin@gmail.com',
      }}
      fallback={
        <div className={styles.fallback}>
          <Skeleton>
            <SkeletonItem />
          </Skeleton>
        </div>
      }
    />
  )
}
