export type Tool = {
  name: string
  deferred: boolean
}

export type ToolGroup = {
  name: string
  tools: Tool[]
}

export const AGENT_NAME = 'CM MES Agent'
export const AGENT_STATE = 'Active'

// The 10 tools visible in the reference screenshot, in order, plus the
// 3 remaining tools of the same group so the group totals 13.
export const TOOL_GROUPS: ToolGroup[] = [
  {
    name: 'CM MES',
    tools: [
      { name: 'get_attachment_to_summarize', deferred: false },
      { name: 'get_document_content', deferred: false },
      { name: 'get_document_as_chunks', deferred: false },
      {
        name: 'get_id_from_entity_effective_previous_version',
        deferred: false,
      },
      { name: 'get_id_from_previous_sign_document_revision', deferred: false },
      { name: 'get_attachment_as_chunks', deferred: false },
      { name: 'get_entity_id_by_name_revision_version', deferred: false },
      { name: 'get_object_by_name', deferred: false },
      { name: 'compare_entities', deferred: false },
      { name: 'compare_document_entity', deferred: false },
      { name: 'get_document_summary', deferred: false },
      { name: 'search_documents', deferred: false },
      { name: 'get_entity_history', deferred: false },
    ],
  },
  {
    name: 'Other Servers',
    tools: [
      { name: 'search_analytics_views', deferred: true },
      { name: 'get_kpi_definition', deferred: true },
    ],
  },
]

export const TOTAL_TOOLS = TOOL_GROUPS.reduce(
  (sum, group) => sum + group.tools.length,
  0
)

export const DETAIL_CARDS: Array<{
  title: string
  fields: Array<{ label: string; value: string }>
}> = [
  {
    title: 'AI Agent',
    fields: [
      { label: 'Name', value: 'CM MES Agent' },
      {
        label: 'Description',
        value: 'MES agent exposing CM MES tools over MCP',
      },
      { label: 'Universal State', value: 'Active' },
    ],
  },
  {
    title: 'Information',
    fields: [
      { label: 'Provider', value: 'bedrock' },
      { label: 'Runtime', value: 'LibreChat' },
      { label: 'Publish To Runtime', value: 'Yes' },
      { label: 'Synchronization Status', value: 'Pending' },
    ],
  },
]

export const INSTRUCTIONS =
  'Answer MES questions by calling the MCP tools below. Prefer get_object_by_name and get_entity_id_by_name_revision_version to resolve names before reading documents.'
