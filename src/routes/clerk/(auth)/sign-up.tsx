/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router'
import { SignUp } from '@clerk/react'
import { makeStyles } from '@fluentui/react-components'
import { Skeleton, SkeletonItem } from '@/components/ui/skeleton'

const useStyles = makeStyles({
  fallback: {
    width: '400px',
    height: '480px',
  },
})

export const Route = createFileRoute('/clerk/(auth)/sign-up')({
  component: ClerkSignUp,
})

function ClerkSignUp() {
  const styles = useStyles()
  return (
    <SignUp
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
