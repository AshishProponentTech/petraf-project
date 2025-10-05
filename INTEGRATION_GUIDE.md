# Petraf Frontend-Backend Integration Guide

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file in your project root:

```bash
# For Development (Mock APIs)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_TENANT_ID=550e8400-e29b-41d4-a716-446655440000

# For Production (Real APIs)
# NEXT_PUBLIC_API_URL=https://thctil8puin2q-api.prod1a.defang.dev
# NEXT_PUBLIC_USE_MOCK_API=false
# NEXT_PUBLIC_TENANT_ID=YOUR_TENANT_ID_HERE

# Admin Configuration
NEXT_PUBLIC_ADMIN_KEY=admin_sk_sunrise_abc123xyz789
```

### 2. API Client Usage

```typescript
import { api, isUsingRealAPI, getCurrentAPIUrl } from '@/src/lib/api'

// Check if using real API
if (isUsingRealAPI()) {
  console.log('Using production API:', getCurrentAPIUrl())
}

// Create a session
const session = await api.createSession()

// Get session state
const state = await api.getSessionState(session.session_id)

// Stream chat messages
for await (const event of api.streamChat('g4_future', {
  session_id: session.session_id,
  message: 'Hello',
  phase: 'g4_future',
  step: 'collect'
})) {
  console.log('SSE Event:', event.event, event.data)
}
```

## 🔧 Fixed Issues

### 1. **Updated API Types**
- Added support for all SSE event types: `score`, `step_transition`, `phase_transition`, `goal_saved`, `error`
- Added missing goal types: `role`, `themes`, `focus`
- Added session state management types
- Updated phase names to match backend documentation

### 2. **Enhanced API Client**
- Added `getSessionState()` method
- Added `advanceStep()` method for manual step transitions
- Fixed SSE parsing to handle all event types
- Updated chat streaming to support all phases

### 3. **Environment Configuration**
- Updated default tenant ID to match documentation
- Added production API URL configuration
- Added helper functions to check API status

## 📋 Complete API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/session/create` | POST | Create new session |
| `/api/session/{id}/info` | PUT | Update session info |
| `/api/session/{id}/state` | GET | Get current FSM state |
| `/api/session/{id}/advance-step` | POST | Advance to next step |
| `/api/session/resume` | POST | Resume session with token |
| `/api/chat/{phase}/stream` | POST | Stream chat messages |
| `/api/goals/session/{id}` | GET | Get session goals |
| `/api/admin/stats/overview` | GET | Admin statistics |
| `/api/admin/audit-logs` | GET | Admin audit logs |
| `/api/admin/rag/upload/{tenant}` | POST | Upload RAG documents |

## 🎯 Supported Phases

| Phase | Goal Type | Description |
|-------|-----------|-------------|
| `g2_basic_info` | N/A | Employee information form |
| `g3_policy` | N/A | Company policies input |
| `g4_future` | `future` | 3-year vision goals |
| `g4_role` | `role` | Current role goals |
| `g6_values` | `values` | Professional values |
| `g6_themes` | `themes` | Annual themes |
| `g8_focus` | `focus` | Key challenges |
| `g8_actions` | `actions` | Action plans |

## 🔄 FSM Flow

```
g2_basic_info → g3_policy → g4_future → g4_role → g6_values → g6_themes → g8_focus → g8_actions → completed
```

Each phase follows: `collect` → `refine` → `score` → `finalize`

## 🚨 Important Notes

### Tenant ID Configuration
The production API requires a valid tenant ID. You may need to:
1. Contact your backend team to get a valid tenant ID
2. Or use the mock API for development: `NEXT_PUBLIC_USE_MOCK_API=true`

### SSE Event Handling
The API now supports all SSE events from your documentation:
- `message`: AI response content
- `score`: Goal scoring results
- `step_transition`: Step changes (collect → refine → score)
- `phase_transition`: Phase changes (g4_future → g4_role)
- `goal_saved`: Goal finalized and saved
- `error`: Error messages

### Error Handling
All API calls now include proper error handling for:
- Network errors
- Invalid step transitions
- Session expiration
- Score below threshold

## 🧪 Testing

Run the test script to verify API integration:

```bash
node test-api.js
```

This will test:
- Health endpoint
- Session creation
- Error handling

## 📚 Next Steps

1. **Get Valid Tenant ID**: Contact your backend team for a production tenant ID
2. **Test All Phases**: Use the complete API test sequence from your documentation
3. **Update Frontend Components**: Ensure all screens use the updated API client
4. **Add Error Handling**: Implement proper error handling in your UI components

## 🔗 Resources

- **Backend API**: https://thctil8puin2q-api.prod1a.defang.dev/docs
- **Frontend Documentation**: frontend-doc.txt
- **Backend Documentation**: backend-doc.txt
- **API Test Sequence**: backend-doc.txt (Step 1-21)


