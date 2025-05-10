# Deploying SimplePollo Frontend to Vercel

This guide explains how to deploy the SimplePollo frontend to Vercel.

## Prerequisites

1. A GitHub account with your SimplePollo repository
2. A Vercel account (can sign up with your GitHub account)
3. Your backend already deployed to Railway (or another platform)

## Step 1: Push Your Code to GitHub

Before deploying to Vercel, ensure your code is pushed to GitHub:

```bash
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Using the Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com/) and sign in with your GitHub account
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Environment Variables:
   - Add `VITE_API_URL` with your Railway backend URL (e.g., `https://simplepollo-production.up.railway.app`)
6. Click "Deploy"

### Option B: Using the Vercel CLI

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to your frontend directory:
   ```bash
   cd apps/frontend
   ```

3. Run the Vercel deployment:
   ```bash
   vercel
   ```

4. Follow the interactive prompts
   - Link to your Vercel account
   - Select your project/create a new one
   - Set your environment variables when prompted

5. After deployment, run:
   ```bash
   vercel --prod
   ```

## Step 3: Update Frontend Environment

After deployment, you can update your environment variables in the Vercel dashboard:

1. Go to your project in the Vercel dashboard
2. Click on "Settings" → "Environment Variables"
3. Add or update `VITE_API_URL` with your backend URL
4. Click "Save"
5. Redeploy your project for the changes to take effect

## Step 4: Update CORS Configuration on Your Backend

Make sure your Railway backend allows requests from your Vercel domain:

1. Get your Vercel deployment URL (e.g., `https://simplepollo.vercel.app`)
2. Add it to your backend's CORS configuration:

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://simplepollo.vercel.app', // Your Vercel domain
    process.env.FRONTEND_URL || '*'
  ],
  credentials: true
}));
```

3. Update and redeploy your backend

## Step 5: Setting Up a Custom Domain (Optional)

To use a custom domain:

1. Go to your project in the Vercel dashboard
2. Click on "Settings" → "Domains"
3. Add your custom domain
4. Follow Vercel's instructions to configure DNS records

## Troubleshooting

### Deployment Failed

- Check the build logs in Vercel for specific errors
- Ensure all dependencies are correctly installed
- Verify your project structure and configuration files

### API Connection Issues

- Check the browser console for CORS errors
- Verify your environment variables are correctly set
- Ensure your backend is running and accessible

### Routing Issues

- The `vercel.json` file should handle client-side routing
- If pages return 404 errors, check that rewrites are working correctly

## Next Steps

After successful deployment:

1. Set up automatic deployments from GitHub (enabled by default)
2. Configure preview deployments for pull requests
3. Set up monitoring and analytics in the Vercel dashboard 