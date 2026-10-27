import {
  Button,
  Card,
  CardHeader,
  Divider,
  Nav,
  NavItem,
  Text,
  makeStyles,
} from '@fluentui/react-components'
import { ChevronRight24Regular } from '@fluentui/react-icons'
import { SECTIONS, type SectionId } from '../types'

const useStyles = makeStyles({
  card: {
    // Card supplies background, border, radius and shadow; this class
    // only keeps the card a flex column that stretches to full height.
    // Padding is set to 0 inline on the Card so headers/nav sit flush,
    // as in the reference, instead of inside Card's default padding.
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  detailsViewHeader: {
    // Reference title row is ~39-40px tall: 10px vertical padding,
    // not 16px (which made it ~56px tall).
    padding: '10px 16px',
  },
  detailsViewNav: {
    display: 'flex',
    flexDirection: 'column',
    // Native Nav / reference rows: full-width, flush, no gap and no
    // side padding. The previous 8px gap + 8px side padding turned
    // every item into a grey pill, which is not native Nav (its item
    // background is transparent on the card) and not the reference
    // (white rows, selected row only marked by bar + bold).
    gap: '0px',
    // 8px left inset, as on the rail: the active bar sits 8px from
    // the card edge, not flush to it. The bar-to-text gap stays ~13px
    // because the text still starts 16px inside the button.
    padding: '0px 0px 0px 8px',
    // Single selected-item bar, same technique as the rail: 3px ×
    // 20px, centred, brand blue, no fill — the user's chosen
    // Nav-original form. Fluent Nav's own ::after is hidden, or the
    // selected row shows two bars.
    '& [aria-current="page"]': {
      backgroundImage: 'linear-gradient(#0f6cbd, #0f6cbd)',
      backgroundSize: '3px 20px',
      backgroundPosition: 'left center',
      backgroundRepeat: 'no-repeat',
    },
    '& [aria-current="page"]::after': {
      display: 'none',
    },
  },
})

type DetailsCardProps = {
  sectionId: SectionId
  onSectionChange: (id: SectionId) => void
}

export default function DetailsCard({
  sectionId,
  onSectionChange,
}: DetailsCardProps) {
  const styles = useStyles()
  return (
    <Card
      className={styles.card}
      style={{
        padding: '0px',
        borderRadius: '8px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
      }}
    >
      <CardHeader
        className={styles.detailsViewHeader}
        header={<Text weight='semibold'>Details View</Text>}
        action={
          <Button
            appearance='transparent'
            size='small'
            icon={<ChevronRight24Regular />}
            aria-label='Expand Details View'
          />
        }
      />
      <div style={{ flexShrink: 0 }}>
        <Divider />
      </div>
      <Nav
        className={styles.detailsViewNav}
        selectedValue={sectionId}
        onNavItemSelect={(_, data) => onSectionChange(data.value as SectionId)}
      >
        {SECTIONS.map((section) => (
          <NavItem
            key={section.id}
            value={section.id}
            style={{ backgroundColor: 'transparent' }}
          >
            {section.label}
          </NavItem>
        ))}
      </Nav>
    </Card>
  )
}
