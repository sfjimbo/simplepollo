# Connecting SimplePollo Frontend to Backend

This guide explains how to configure the SimplePollo frontend to connect to different backend environments.

## How the Configuration Works

The frontend uses environment variables to determine which backend API URL to use. This is handled in the `src/config.ts` file:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'https://simplepollo-production.up.railway.app';

export const config = {
  apiUrl: API_URL,
};
```

## Configuration Files

The project includes environment-specific configuration files:

- `.env.development` - Used during development (`npm run dev`)
- `.env.production` - Used during production builds (`npm run build`)

## Connecting to Different Backend Environments

### Local Development (Default)

When running locally, the frontend will connect to a local backend by default:

```
# In .env.development
VITE_API_URL=http://localhost:4000
```

### Railway Deployment

After deploying your backend to Railway:

1. Get your API URL from the Railway dashboard (e.g., `https://simplepollo-production.up.railway.app`)
2. Update `.env.production` with your actual Railway URL:

```
# In .env.production
VITE_API_URL=https://your-railway-api-url.up.railway.app
```

3. When you build the frontend, it will use this production URL:

```bash
cd apps/frontend
npm run build
```

### Using a Different Backend URL Temporarily

You can temporarily override the backend URL by setting the environment variable when running the frontend:

```bash
# On macOS/Linux
VITE_API_URL=https://my-custom-backend.com npm run dev

# On Windows (Command Prompt)
set VITE_API_URL=https://my-custom-backend.com && npm run dev

# On Windows (PowerShell)
$env:VITE_API_URL="https://my-custom-backend.com"; npm run dev
```

## Verifying the Connection

To verify which backend URL the frontend is using:

1. Open the browser developer console (F12 or right-click → Inspect)
2. Look for console logs showing API requests to your backend URL
3. You should see requests going to the configured URL (e.g., `http://localhost:4000` or your Railway URL)

## Troubleshooting

If the frontend can't connect to the backend:

1. **CORS errors**: Ensure your backend's CORS configuration includes your frontend's origin
2. **Network errors**: Check if the backend is running and accessible from your network
3. **URL issues**: Verify the API URL has the correct protocol (http/https) and no trailing slash

The backend CORS configuration (in `index.ts`) should include your frontend's URL:

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://your-frontend-domain.com',  // Add your frontend domain here
    process.env.FRONTEND_URL || '*'      // Or set this environment variable
  ],
  credentials: true
}));
``` 