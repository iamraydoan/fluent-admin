import globals from 'globals'
import js from '@eslint/js'
import pluginQuery from '@tanstack/eslint-plugin-query'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig(
  // NOTE: src/components/ui used to be ignored when it held copied
  // shadcn code. It now holds our own Fluent wrappers, so it is
  // linted like any other source file.
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...pluginQuery.configs['flat/recommended'],
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-console': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      // Enforce type-only imports for TypeScript types
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      // Prevent duplicate imports from the same module
      'no-duplicate-imports': 'error',
    },
  },
  {
    // Fluent components must be imported through the wrappers in
    // src/components/ui (kept under their original names), so a style
    // change in one wrapper file applies system-wide. This block
    // covers only the component names that already have wrappers;
    // it does not block the whole package: makeStyles, tokens,
    // FluentProvider and theme (webLightTheme/createLightTheme) may
    // still be imported directly, as may icons from
    // @fluentui/react-icons. The wrappers themselves live under
    // src/components/ui and are exempt from this rule.
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/components/ui/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@fluentui/react-components',
              importNames: [
                'Accordion',
                'AccordionHeader',
                'AccordionItem',
                'AccordionPanel',
                'Avatar',
                'Badge',
                'Button',
                'Card',
                'CardHeader',
                'Checkbox',
                'Combobox',
                'Dialog',
                'DialogActions',
                'DialogBody',
                'DialogContent',
                'DialogSurface',
                'DialogTitle',
                'DialogTrigger',
                'Divider',
                'Drawer',
                'DrawerBody',
                'DrawerFooter',
                'DrawerHeader',
                'Field',
                'Input',
                'Label',
                'Link',
                'Menu',
                'MenuItem',
                'MenuList',
                'MenuPopover',
                'MenuTrigger',
                'MessageBar',
                'MessageBarActions',
                'MessageBarBody',
                'Nav',
                'NavItem',
                'NavSectionHeader',
                'Option',
                'OptionGroup',
                'Popover',
                'PopoverSurface',
                'PopoverTrigger',
                'ProgressBar',
                'Radio',
                'RadioGroup',
                'Select',
                'Skeleton',
                'SkeletonItem',
                'Spinner',
                'Switch',
                'Tab',
                'TabList',
                'Table',
                'TableBody',
                'TableCell',
                'TableHeader',
                'TableHeaderCell',
                'TableRow',
                'Text',
                'Textarea',
                'Toast',
                'ToastBody',
                'ToastTitle',
                'Toaster',
                'Tooltip',
                'Toolbar',
                'ToolbarButton',
                'ToolbarDivider',
                'ToolbarGroup',
              ],
              message:
                'Import this Fluent component from its @/components/ui wrapper instead of @fluentui/react-components directly, so system-wide style changes apply. Utilities (makeStyles, tokens, FluentProvider, theme) and @fluentui/react-icons may still be imported directly.',
            },
          ],
        },
      ],
    },
  }
)
