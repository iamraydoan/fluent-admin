export type SectionId =
  'details' | 'instructions' | 'mcp-servers' | 'attachments'

export const SECTIONS: Array<{ id: SectionId; label: string }> = [
  { id: 'details', label: 'Details' },
  { id: 'instructions', label: 'Instructions' },
  { id: 'mcp-servers', label: 'MCP Servers' },
  { id: 'attachments', label: 'Attachments' },
]
