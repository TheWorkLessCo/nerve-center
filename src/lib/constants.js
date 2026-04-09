export const AGENT_COLOR_MAP = {
  Sabbath: {
    bg: 'rgba(216,90,48,0.15)',
    text: '#993C3C',
    border: 'rgba(216,90,48,0.3)',
  },
  Onboarder: {
    bg: 'rgba(127,119,221,0.15)',
    text: '#5B52C4',
    border: 'rgba(127,119,221,0.3)',
  },
  'DWB Ops': {
    bg: 'rgba(29,158,117,0.15)',
    text: '#1D9E75',
    border: 'rgba(29,158,117,0.3)',
  },
  'TWC Ops': {
    bg: 'rgba(24,95,165,0.15)',
    text: '#185FA5',
    border: 'rgba(24,95,165,0.3)',
  },
  Selah: {
    bg: 'rgba(236,72,153,0.15)',
    text: '#DB2777',
    border: 'rgba(236,72,153,0.3)',
  },
}

export const QUICK_LINKS = [
  { name: 'OpenClaw', url: 'http://72.62.83.62:4000', icon: 'OpenClaw', description: 'OpenClaw Gateway' },
  { name: 'n8n', url: 'https://natetibbs.app.n8n.cloud', icon: 'N8N', description: 'Workflow automation' },
  { name: 'Supabase', url: 'https://supabase.com/dashboard', icon: 'Supabase', description: 'Database & auth' },
  { name: 'GHL', url: 'https://app.gohighlevel.com', icon: 'GHL', description: 'GoHighLevel CRM' },
  { name: 'Vercel', url: 'https://vercel.com/dashboard', icon: 'Vercel', description: 'Frontend deployments' },
  { name: 'Cloudflare', url: 'https://dash.cloudflare.com', icon: 'Cloudflare', description: 'DNS & CDN' },
  { name: 'OpenRouter', url: 'https://openrouter.ai', icon: 'OpenRouter', description: 'AI model routing' },
  { name: 'ElevenLabs', url: 'https://elevenlabs.io', icon: 'ElevenLabs', description: 'Voice synthesis' },
]

export const STATUS_OPTIONS = ['online', 'offline', 'error', 'warning']

export const DEFAULT_PAGE_SIZE = 20

export const MOCK_MEMORY_FILES = [
  {
    path: 'Agents/sabbath-context.md',
    name: 'sabbath-context.md',
    content: `# Sabbath Agent Context

## Overview
Sabbath is the primary orchestration agent responsible for coordinating all DWB operations workflows.

## Capabilities
- Multi-agent task delegation
- Real-time activity monitoring
- Memory persistence and retrieval

## Configuration
\`\`\`json
{
  "model": "minimax-m2.7",
  "temperature": 0.7,
  "max_tokens": 8192
}
\`\`\`

## Recent Activity
Last updated: ${new Date().toISOString().split('T')[0]}
`,
  },
  {
    path: 'Agents/onboarder-context.md',
    name: 'onboarder-context.md',
    content: `# Onboarder Agent Context

## Overview
Handles new client onboarding workflows including document collection, setup, and initial training.

## Workflow Steps
1. Welcome email sequence
2. Document collection checklist
3. Platform walkthrough scheduling
4. Follow-up sequence

## Configuration
\`\`\`json
{
  "model": "minimax-m2.7",
  "temperature": 0.5
}
\`\`\`
`,
  },
  {
    path: 'Agents/dwb-ops-context.md',
    name: 'dwb-ops-context.md',
    content: `# DWB Ops Agent Context

## Overview
Manages day-to-day operations including task tracking, reporting, and issue escalation.

## Responsibilities
- Task distribution and tracking
- Daily standup summaries
- Incident escalation
`,
  },
  {
    path: 'Agents/twc-ops-context.md',
    name: 'twc-ops-context.md',
    content: `# TWC Ops Agent Context

## Overview
Coordinates The Warm Corner operations and client communications.

## Key Processes
- Client check-ins
- Delivery scheduling
- Feedback collection
`,
  },
  {
    path: 'Agents/selah-context.md',
    name: 'selah-context.md',
    content: `# Selah Agent Context

## Overview
Handles internal documentation, knowledge management, and process refinement.

## Focus Areas
- Knowledge base maintenance
- SOP documentation
- Training material updates
`,
  },
  {
    path: 'System/memory-guide.md',
    name: 'memory-guide.md',
    content: `# Memory System Guide

## Overview
The memory system uses a file-based approach with n8n webhooks for persistence.

## File Structure
\`\`\`
Agents/        - Agent-specific context files
System/        - System-level documentation
Projects/      - Project-specific memory
\`\`\`

## Operations
- **LIST**: GET request to list all memory files
- **READ**: GET request with path to read a file
- **WRITE**: POST request to create/update a file
`,
  },
  {
    path: 'System/api-keys.md',
    name: 'api-keys.md',
    content: `# API Keys Reference

## Active Services
| Service | Key Type | Status |
|---------|----------|--------|
| OpenAI | Production | Active |
| Supabase | Production | Active |
| N8N | Production | Active |

## Rotation Schedule
Keys should be rotated every 90 days per security policy.
`,
  },
]

export const MOCK_CHAT_MESSAGES = [
  {
    id: '1',
    role: 'user',
    content: 'What is the current status of the DWB Ops agent?',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    role: 'assistant',
    agent: 'Sabbath',
    content: 'The DWB Ops agent is currently online and processing 3 active workflows. Last heartbeat was 2 minutes ago. All systems nominal.',
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
  },
  {
    id: '3',
    role: 'user',
    content: 'Can you show me the recent activity from today?',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
  },
  {
    id: '4',
    role: 'assistant',
    agent: 'Sabbath',
    content: "Here are today's activity highlights:\n\n• 12:04 PM — DWB Ops completed task batch #1847\n• 11:30 AM — Onboarder initiated welcome sequence for new client Acme Corp\n• 10:15 AM — TWC Ops escalated issue #regex in ticket #892\n• 09:00 AM — Selah updated knowledge base with new SOP v2.3\n\nAll activity logs are available in the Activity view.",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
  },
  {
    id: '5',
    role: 'user',
    content: 'Push the updated memory files to the repository.',
    timestamp: new Date(Date.now() - 1000 * 30),
  },
  {
    id: '6',
    role: 'assistant',
    agent: 'Sabbath',
    content: 'Memory files have been synchronized. 7 files pushed successfully. Last sync: just now.',
    timestamp: new Date(Date.now() - 1000 * 10),
  },
]

export const MOCK_ACTIVITY = [
  {
    id: '1',
    agent: 'Sabbath',
    action: 'Synchronized memory files',
    description: '7 files pushed to repository',
    status: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
  },
  {
    id: '2',
    agent: 'DWB Ops',
    action: 'Completed task batch #1847',
    description: '47 tasks processed, 0 failures',
    status: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
  },
  {
    id: '3',
    agent: 'Onboarder',
    action: 'Started welcome sequence',
    description: 'New client: Acme Corp',
    status: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '4',
    agent: 'TWC Ops',
    action: 'Escalated ticket #892',
    description: 'Issue #regex requires human review',
    status: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: '5',
    agent: 'Selah',
    action: 'Updated knowledge base',
    description: 'SOP v2.3 published',
    status: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: '6',
    agent: 'Sabbath',
    action: 'Scheduled daily standup',
    description: 'All agents confirmed attending',
    status: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
  },
  {
    id: '7',
    agent: 'DWB Ops',
    action: 'Failed to process batch #1846',
    description: 'Timeout reaching external API',
    status: 'error',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
  },
  {
    id: '8',
    agent: 'Onboarder',
    action: 'Completed document verification',
    description: 'Client: Globex Inc — all docs valid',
    status: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
  },
  {
    id: '9',
    agent: 'TWC Ops',
    action: 'Generated weekly report',
    description: 'Sent to 3 stakeholders',
    status: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 240),
  },
  {
    id: '10',
    agent: 'Selah',
    action: 'Created training module',
    description: 'Module: "Advanced Task Routing"',
    status: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 300),
  },
]

export const MOCK_DOCS = [
  {
    id: '1',
    project: 'DWB Ops',
    title: 'Daily Standup Process',
    description: 'Standard operating procedure for daily standups including timing, attendees, and agenda templates.',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
  {
    id: '2',
    project: 'Onboarder',
    title: 'Client Welcome Email Template',
    description: 'HTML email template for new client onboarding. Includes branding guidelines and CTA placement.',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: '3',
    project: 'System',
    title: 'API Authentication Guide',
    description: 'How to configure and rotate API keys across all connected services. Includes security best practices.',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
  {
    id: '4',
    project: 'Selah',
    title: 'Knowledge Base Structure',
    description: 'Overview of the knowledge base organization, tagging system, and search optimization.',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
  },
  {
    id: '5',
    project: 'TWC Ops',
    title: 'Issue Escalation Matrix',
    description: 'Decision tree for when and how to escalate issues. Includes contact information and SLAs.',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
  },
  {
    id: '6',
    project: 'DWB Ops',
    title: 'Task Batch Processing Guide',
    description: 'How to configure batch sizes, retry policies, and monitoring for automated task processing.',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 120),
  },
  {
    id: '7',
    project: 'System',
    title: 'Memory System Architecture',
    description: 'Technical documentation for the file-based memory system including n8n webhook integration.',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 168),
  },
  {
    id: '8',
    project: 'Onboarder',
    title: 'Document Checklist v3',
    description: 'Required documents for client onboarding. Updated checklist with new compliance requirements.',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 200),
  },
]
