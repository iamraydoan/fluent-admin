import { makeStyles, tokens } from '@fluentui/react-components'
import { Avatar } from '@/components/ui/avatar'
import { Text } from '@/components/ui/text'

const useStyles = makeStyles({
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXXL,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalL,
  },
  info: {
    display: 'flex',
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalS,
  },
  meta: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  email: {
    color: tokens.colorNeutralForeground3,
  },
})

const sales = [
  {
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    initials: 'OM',
    image: '/avatars/01.png',
  },
  {
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    initials: 'JL',
    image: '/avatars/02.png',
  },
  {
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    initials: 'IN',
    image: '/avatars/03.png',
  },
  {
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    initials: 'WK',
    image: '/avatars/04.png',
  },
  {
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    initials: 'SD',
    image: '/avatars/05.png',
  },
]

export function RecentSales() {
  const styles = useStyles()
  return (
    <div className={styles.list}>
      {sales.map((sale) => (
        <div key={sale.email} className={styles.row}>
          <Avatar
            name={sale.name}
            image={{ src: sale.image, alt: 'Avatar' }}
            size={36}
          />
          <div className={styles.info}>
            <div className={styles.meta}>
              <Text weight='semibold'>{sale.name}</Text>
              <Text size={200} className={styles.email}>
                {sale.email}
              </Text>
            </div>
            <Text weight='semibold'>{sale.amount}</Text>
          </div>
        </div>
      ))}
    </div>
  )
}
