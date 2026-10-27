import { makeStyles, tokens } from '@fluentui/react-components'
import { Divider } from '@/components/ui/divider'
import { Tab, TabList } from '@/components/ui/tabs'

const useStyles = makeStyles({
  objectTabs: {
    backgroundColor: tokens.colorNeutralBackground1,
    paddingLeft: tokens.spacingHorizontalL,
    // Reference selected tab text is brand blue, not black bold.
    '& [aria-selected="true"]': {
      color: tokens.colorBrandForeground1,
    },
  },
})

export type PageTab = {
  value: string
  label: string
}

export type PageTabsProps = {
  tabs: PageTab[]
  selected?: string
  onChange?: (value: string) => void
}

// Object-tab row, extracted from PageTop unchanged: the objectTabs
// div + TabList + trailing Divider, in that order. PageTop renders
// this only when tabs is non-empty, so no empty row is left behind.
export default function PageTabs({ tabs, selected, onChange }: PageTabsProps) {
  const styles = useStyles()
  return (
    <>
      <div className={styles.objectTabs}>
        <TabList
          size='small'
          selectedValue={selected}
          onTabSelect={(_, data) => onChange?.(String(data.value))}
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} value={tab.value}>
              {tab.label}
            </Tab>
          ))}
        </TabList>
      </div>
      <Divider />
    </>
  )
}
