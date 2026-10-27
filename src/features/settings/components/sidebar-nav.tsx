import { useState, type JSX } from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { makeStyles } from '@fluentui/react-components'
import { Nav, NavItem } from '@/components/ui/nav'
import { Select } from '@/components/ui/select'

const useStyles = makeStyles({
  mobileSelect: {
    padding: '4px',
    '@media (min-width: 768px)': {
      display: 'none',
    },
  },
  navWrap: {
    display: 'none',
    minWidth: '160px',
    padding: '4px 8px',
    '@media (min-width: 768px)': {
      display: 'block',
    },
  },
})

type SidebarNavProps = {
  items: {
    href: string
    title: string
    icon?: JSX.Element
  }[]
}

export function SidebarNav({ items }: SidebarNavProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [val, setVal] = useState(pathname ?? '/settings')
  const styles = useStyles()

  const handleSelect = (value: string) => {
    setVal(value)
    navigate({ to: value })
  }

  return (
    <>
      <div className={styles.mobileSelect}>
        <Select
          value={val}
          onChange={(e) => handleSelect(e.target.value)}
          aria-label='Settings section'
        >
          {items.map((item) => (
            <option key={item.href} value={item.href}>
              {item.title}
            </option>
          ))}
        </Select>
      </div>

      <div className={styles.navWrap}>
        <Nav
          selectedValue={pathname}
          onNavItemSelect={(_, data) => {
            if (typeof data.value === 'string') {
              handleSelect(data.value)
            }
          }}
        >
          {items.map((item) => (
            <NavItem key={item.href} value={item.href} icon={item.icon}>
              {item.title}
            </NavItem>
          ))}
        </Nav>
      </div>
    </>
  )
}
