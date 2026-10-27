import { useEffect } from 'react'
import {
  Checkmark20Regular,
  WeatherMoon20Regular,
  WeatherSunny20Regular,
} from '@fluentui/react-icons'
import { useTheme } from '@/context/theme-provider'
import { Button } from '@/components/ui/button'
import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@/components/ui/menu'

export function ThemeSwitch() {
  const { theme, resolvedTheme, setTheme } = useTheme()

  /* Update theme-color meta tag when theme is updated */
  useEffect(() => {
    const themeColor = resolvedTheme === 'dark' ? '#020817' : '#fff'
    const metaThemeColor = document.querySelector("meta[name='theme-color']")
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor)
  }, [resolvedTheme])

  return (
    <Menu>
      <MenuTrigger>
        <Button
          appearance='subtle'
          shape='circular'
          aria-label='Toggle theme'
          icon={
            resolvedTheme === 'dark' ? (
              <WeatherMoon20Regular />
            ) : (
              <WeatherSunny20Regular />
            )
          }
        />
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem
            icon={theme === 'light' ? <Checkmark20Regular /> : undefined}
            onClick={() => setTheme('light')}
          >
            Light
          </MenuItem>
          <MenuItem
            icon={theme === 'dark' ? <Checkmark20Regular /> : undefined}
            onClick={() => setTheme('dark')}
          >
            Dark
          </MenuItem>
          <MenuItem
            icon={theme === 'system' ? <Checkmark20Regular /> : undefined}
            onClick={() => setTheme('system')}
          >
            System
          </MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  )
}
