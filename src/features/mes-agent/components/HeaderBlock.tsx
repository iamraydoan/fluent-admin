import {
  Divider,
  Tab,
  TabList,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import DocumentTabBar from './DocumentTabBar'
import Ribbon from './Ribbon'
import TitleStrip from './TitleStrip'

const useStyles = makeStyles({
  // One DOM block for the whole header. Its top row is the grey
  // document-tab strip (as in the reference); every row below it is white
  // and touches the next row, separated only by a 1px divider.
  headerBlock: {
    flexShrink: 0,
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
    // Header reads as a top bar, not a floating card: with the page
    // top padding removed (see index.tsx), the top corners are
    // square (radius 0) so the header touches the viewport top edge
    // with no canvas strip and no rounded corner showing above it.
    // Bottom corners keep the cards' 8px radius, so the header still
    // curves against the grey content gap below it, as in the demo.
    // overflow hidden is required, otherwise the square white/grey
    // rows inside would paint over the rounded bottom corners.
    borderRadius: '0px 0px 8px 8px',
    overflow: 'hidden',
  },
  objectTabs: {
    backgroundColor: '#ffffff',
    paddingLeft: '16px',
    // Reference selected tab text is brand blue, not black bold.
    '& [aria-selected="true"]': {
      color: tokens.colorBrandForeground1,
    },
  },
})

type HeaderBlockProps = {
  objectTab: string
  onObjectTabChange: (value: string) => void
  headerCollapsed: boolean
  onCollapseHeader: () => void
  onExpandHeader: () => void
  notify: (message: string) => void
}

export default function HeaderBlock({
  objectTab,
  onObjectTabChange,
  headerCollapsed,
  onCollapseHeader,
  onExpandHeader,
  notify,
}: HeaderBlockProps) {
  const styles = useStyles()
  return (
    <div className={styles.headerBlock}>
      <DocumentTabBar
        headerCollapsed={headerCollapsed}
        onExpandHeader={onExpandHeader}
      />
      {!headerCollapsed && (
        <>
          <div className={styles.objectTabs}>
            <TabList
              size='small'
              selectedValue={objectTab}
              onTabSelect={(_, data) => onObjectTabChange(String(data.value))}
            >
              <Tab value='Details'>Details</Tab>
              <Tab value='References'>References</Tab>
              <Tab value='History'>History</Tab>
            </TabList>
          </div>
          <Divider />
          <Ribbon notify={notify} />
          <Divider />
          <TitleStrip onCollapse={onCollapseHeader} />
        </>
      )}
    </div>
  )
}
