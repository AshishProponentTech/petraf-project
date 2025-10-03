# Migration Guide: Current → Improved Structure

## Step 1: Create New Directory Structure

```bash
# Create src directory and move files
mkdir -p src/{app,components,lib/{api,hooks,store,utils,types},styles}
mkdir -p src/lib/api/{endpoints,mock/data}
mkdir -p src/components/{features,layout,screens,ui}

# Move existing files
mv app/* src/app/
mv components/* src/components/
mv lib/* src/lib/
mv hooks/* src/lib/hooks/
```

## Step 2: Update Import Paths

### In all components, change:
```typescript
// From:
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"

// To:
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
```

## Step 3: Update API Usage

### Replace current api.ts with new structure:

```typescript
// Old usage in components:
const response = await api.createSession()

// New usage (same interface, better implementation):
const response = await api.createSession()
```

## Step 4: Add Environment Variables

Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_TENANT_ID=550e8400-e29b-41d4-a716-446655440000
```

## Step 5: Update Next.js Config

Update `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // Add src directory support
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    }
    return config
  },
}

module.exports = nextConfig
```

## Step 6: Update TypeScript Config

Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

## Benefits After Migration:

1. **Better Organization**: Clear separation of concerns
2. **Type Safety**: Comprehensive TypeScript types
3. **API Flexibility**: Easy switch between mock and production
4. **Maintainability**: Feature-based organization
5. **Scalability**: Ready for team growth
6. **Testing**: Easier to test individual components
