import { Link, useNavigate } from '@tanstack/react-router'
import { makeStyles } from '@fluentui/react-components'
import { Navigation24Regular } from '@fluentui/react-icons'
import { Button } from '@/components/ui/button'
import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@/components/ui/menu'

const useStyles = makeStyles({
  mobileMenu: {
    '@media (min-width: 1024px)': {
      display: 'none',
    },
  },
  desktopNav: {
    display: 'none',
    '@media (min-width: 1024px)': {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
  },
  navLink: {
    fontSize: '14px',
    fontWeight: 500,
    textDecoration: 'none',
    color: '#242424',
  },
  navLinkMuted: {
    color: '#616161',
  },
})

type TopNavProps = React.HTMLAttributes<HTMLElement> & {
  links: {
    title: string
    href: string
    isActive: boolean
    disabled?: boolean
  }[]
}

export function TopNav({ className, links, ...props }: TopNavProps) {
  const styles = useStyles()
  const navigate = useNavigate()
  return (
    <>
      <span className={styles.mobileMenu}>
        <Menu>
          <MenuTrigger>
            <Button
              appearance='outline'
              icon={<Navigation24Regular />}
              aria-label='Toggle navigation menu'
            />
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {links.map(({ title, href, disabled }) => (
                <MenuItem
                  key={`${title}-${href}`}
                  disabled={disabled}
                  onClick={() => {
                    if (!disabled) navigate({ to: href })
                  }}
                >
                  {title}
                </MenuItem>
              ))}
            </MenuList>
          </MenuPopover>
        </Menu>
      </span>

      <nav className={`${styles.desktopNav} ${className ?? ''}`} {...props}>
        {links.map(({ title, href, isActive, disabled }) => (
          <Link
            key={`${title}-${href}`}
            to={href}
            disabled={disabled}
            className={`${styles.navLink} ${isActive ? '' : styles.navLinkMuted}`}
          >
            {title}
          </Link>
        ))}
      </nav>
    </>
  )
}
