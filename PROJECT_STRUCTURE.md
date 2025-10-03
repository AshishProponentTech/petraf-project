# Recommended Project Structure

```
petraf-project/
├── src/
│   ├── app/                    # Next.js 13+ app directory
│   │   ├── (auth)/
│   │   │   ├── admin/
│   │   │   │   └── page.tsx
│   │   │   └── users/
│   │   │       └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── features/           # Feature-specific components
│   │   │   ├── auth/
│   │   │   ├── chat/
│   │   │   ├── goals/
│   │   │   └── admin/
│   │   ├── layout/             # Layout components
│   │   │   └── SidebarLayout.tsx
│   │   ├── screens/            # Screen components
│   │   │   ├── BasicInfoScreen.tsx
│   │   │   ├── ChatScreen.tsx
│   │   │   ├── GoalsScreen.tsx
│   │   │   ├── IntroScreen.tsx
│   │   │   ├── SummaryScreen.tsx
│   │   │   └── TokenScreen.tsx
│   │   └── ui/                 # Reusable UI components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       └── ...
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts       # API client configuration
│   │   │   ├── types.ts        # API types
│   │   │   ├── endpoints/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── sessions.ts
│   │   │   │   ├── goals.ts
│   │   │   │   └── admin.ts
│   │   │   └── mock/           # Mock implementations
│   │   │       ├── client.ts
│   │   │       └── data/
│   │   ├── hooks/              # Custom hooks
│   │   │   ├── use-session.ts
│   │   │   ├── use-chat.ts
│   │   │   └── use-toast.ts
│   │   ├── store/              # State management
│   │   │   ├── session-store.ts
│   │   │   └── form-store.ts
│   │   ├── utils/
│   │   │   ├── cn.ts
│   │   │   ├── validation.ts
│   │   │   └── constants.ts
│   │   └── types/              # Global types
│   │       ├── api.ts
│   │       ├── session.ts
│   │       └── goals.ts
│   └── styles/
│       └── globals.css
├── public/
│   └── mock/                   # Mock JSON files
│       ├── health.json
│       ├── session_create.json
│       └── ...
├── docs/                       # Documentation
│   ├── API.md
│   └── COMPONENTS.md
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Benefits of this structure:
- **Clear separation** of concerns
- **Feature-based organization** for scalability
- **Centralized API management**
- **Better type organization**
- **Easier testing and maintenance**
