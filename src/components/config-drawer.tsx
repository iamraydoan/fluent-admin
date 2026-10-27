import { useState } from 'react'
import { makeStyles, tokens } from '@fluentui/react-components'
import {
  ArrowReset20Regular,
  Dismiss20Regular,
  Settings20Regular,
} from '@fluentui/react-icons'
import { setCookie } from '@/lib/cookies'
import { useDirection } from '@/context/direction-provider'
import { type Collapsible, useLayout } from '@/context/layout-provider'
import { useTheme } from '@/context/theme-provider'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'

const SIDEBAR_STATE_COOKIE = 'sidebar_state'

const useStyles = makeStyles({
  overlay: {
    position: 'fixed',
    inset: '0',
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  panel: {
    position: 'fixed',
    top: '0',
    right: '0',
    bottom: '0',
    width: '360px',
    maxWidth: '90vw',
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow16,
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    gap: '24px',
    overflowY: 'auto',
    boxSizing: 'border-box',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '8px',
  },
  title: {
    margin: '0',
    fontSize: '20px',
    fontWeight: 600,
  },
  description: {
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  options: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: '8px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  footer: {
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'flex-end',
  },
})

type RadioOption = { value: string; label: string }

function OptionGroup({
  name,
  value,
  options,
  onChange,
}: {
  name: string
  value: string
  options: RadioOption[]
  onChange: (value: string) => void
}) {
  const styles = useStyles()
  return (
    <div className={styles.options} role='radiogroup' aria-label={name}>
      {options.map((item) => {
        const checked = item.value === value
        return (
          <label key={item.value} className={styles.option}>
            {/* Kept native on purpose (Phase 2E): this is a radio
            option, not a text input/select/button. Swapping it means
            restructuring OptionGroup into a RadioGroup (ui/radio-group)
            and re-checking the grid-card layout plus the data-state
            contract asserted in config-drawer.test.tsx — a separate
            follow-up, not this phase's input/select/button swap. */}
            <input
              type='radio'
              name={name}
              value={item.value}
              checked={checked}
              data-state={checked ? 'checked' : 'unchecked'}
              aria-label={`Select ${item.label.toLowerCase()}`}
              onChange={() => onChange(item.value)}
            />
            {item.label}
          </label>
        )
      })}
    </div>
  )
}

function SectionTitle({
  title,
  showReset = false,
  onReset,
  resetAriaLabel,
}: {
  title: string
  showReset?: boolean
  onReset?: () => void
  resetAriaLabel?: string
}) {
  const styles = useStyles()
  return (
    <div className={styles.sectionTitle}>
      <Text weight='semibold'>{title}</Text>
      {showReset && onReset && (
        <Button
          type='button'
          appearance='subtle'
          shape='circular'
          size='small'
          aria-label={resetAriaLabel}
          icon={<ArrowReset20Regular />}
          onClick={onReset}
        />
      )}
    </div>
  )
}

export function ConfigDrawer() {
  const styles = useStyles()
  const [open, setOpen] = useState(false)
  // The old shadcn SidebarProvider is gone; the drawer keeps the
  // sidebar open/closed choice itself via the sidebar_state cookie,
  // which the layout worker owns long-term.
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { resetDir } = useDirection()
  const { resetTheme } = useTheme()
  const { resetLayout } = useLayout()

  const handleReset = () => {
    setSidebarOpen(true)
    setCookie(SIDEBAR_STATE_COOKIE, 'true')
    resetDir()
    resetTheme()
    resetLayout()
  }

  if (!open) {
    return (
      <Button
        appearance='subtle'
        shape='circular'
        aria-label='Open theme settings'
        icon={<Settings20Regular />}
        onClick={() => setOpen(true)}
      />
    )
  }

  return (
    <>
      <Button
        appearance='subtle'
        shape='circular'
        aria-label='Open theme settings'
        icon={<Settings20Regular />}
        onClick={() => setOpen(true)}
      />
      <div className={styles.overlay} onClick={() => setOpen(false)}>
        <div
          role='dialog'
          aria-label='Theme Settings'
          className={styles.panel}
          onClick={(event) => event.stopPropagation()}
        >
          <div className={styles.headerRow}>
            <div>
              <h2 className={styles.title}>Theme Settings</h2>
              <Text size={200} className={styles.description}>
                Adjust the appearance and layout to suit your preferences.
              </Text>
            </div>
            <Button
              appearance='subtle'
              shape='circular'
              size='small'
              aria-label='Close settings'
              icon={<Dismiss20Regular />}
              onClick={() => setOpen(false)}
            />
          </div>
          <ThemeConfig />
          <SidebarConfig />
          <LayoutConfig
            sidebarOpen={sidebarOpen}
            onSidebarOpenChange={(value) => {
              setSidebarOpen(value)
              setCookie(SIDEBAR_STATE_COOKIE, value ? 'true' : 'false')
            }}
          />
          <DirConfig />
          <div className={styles.footer}>
            <Button
              appearance='primary'
              onClick={handleReset}
              aria-label='Reset all settings to default values'
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

function ThemeConfig() {
  const { defaultTheme, theme, setTheme } = useTheme()
  return (
    <div>
      <SectionTitle
        title='Theme'
        showReset={theme !== defaultTheme}
        onReset={() => setTheme(defaultTheme)}
        resetAriaLabel='Reset theme preference to default'
      />
      <OptionGroup
        name='theme'
        value={theme}
        onChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
        options={[
          { value: 'system', label: 'System' },
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ]}
      />
    </div>
  )
}

function SidebarConfig() {
  const { defaultVariant, variant, setVariant } = useLayout()
  return (
    <div>
      <SectionTitle
        title='Sidebar'
        showReset={defaultVariant !== variant}
        onReset={() => setVariant(defaultVariant)}
        resetAriaLabel='Reset sidebar style to default'
      />
      <OptionGroup
        name='sidebar'
        value={variant}
        onChange={(value) =>
          setVariant(value as 'inset' | 'floating' | 'sidebar')
        }
        options={[
          { value: 'inset', label: 'Inset' },
          { value: 'floating', label: 'Floating' },
          { value: 'sidebar', label: 'Sidebar' },
        ]}
      />
    </div>
  )
}

function LayoutConfig({
  sidebarOpen,
  onSidebarOpenChange,
}: {
  sidebarOpen: boolean
  onSidebarOpenChange: (open: boolean) => void
}) {
  const { defaultCollapsible, collapsible, setCollapsible } = useLayout()
  const radioState = sidebarOpen ? 'default' : collapsible

  return (
    <div>
      <SectionTitle
        title='Layout'
        showReset={radioState !== 'default'}
        onReset={() => {
          onSidebarOpenChange(true)
          setCollapsible(defaultCollapsible)
        }}
        resetAriaLabel='Reset layout options to default'
      />
      <OptionGroup
        name='layout'
        value={radioState}
        onChange={(value) => {
          if (value === 'default') {
            onSidebarOpenChange(true)
            return
          }
          onSidebarOpenChange(false)
          setCollapsible(value as Collapsible)
        }}
        options={[
          { value: 'default', label: 'Default' },
          { value: 'icon', label: 'Compact' },
          { value: 'offcanvas', label: 'Full layout' },
        ]}
      />
    </div>
  )
}

function DirConfig() {
  const { defaultDir, dir, setDir } = useDirection()
  return (
    <div>
      <SectionTitle
        title='Direction'
        showReset={defaultDir !== dir}
        onReset={() => setDir(defaultDir)}
        resetAriaLabel='Reset text direction to default'
      />
      <OptionGroup
        name='direction'
        value={dir}
        onChange={(value) => setDir(value as 'ltr' | 'rtl')}
        options={[
          { value: 'ltr', label: 'Left to Right' },
          { value: 'rtl', label: 'Right to Left' },
        ]}
      />
    </div>
  )
}
