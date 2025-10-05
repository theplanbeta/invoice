# Deployment Instructions for Vercel

## Prerequisites
- Vercel account (free tier works fine)
- GitHub repository connected to Vercel

## Steps to Deploy

### 1. Deploy to Vercel
If you haven't already connected your GitHub repo to Vercel:

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository: `theplanbeta/invoice`
4. Vercel will auto-detect it's a Vite project

### 2. Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

   - **Variable Name:** `OUTLOOK_EMAIL`
     **Value:** `info@planbeta.in`
     **Environment:** Production, Preview, Development

   - **Variable Name:** `OUTLOOK_PASSWORD`
     **Value:** `Pbpw@2023`
     **Environment:** Production, Preview, Development

3. Click **Save**

### 3. Redeploy

After adding environment variables:
1. Go to **Deployments** tab
2. Click the three dots on the latest deployment
3. Click **Redeploy**

## Testing Email Functionality

Once deployed:

1. Go to your Vercel deployment URL (e.g., `https://invoice-plan-beta.vercel.app`)
2. Fill in the invoice form including the **Email** field
3. Click **Generate PDF Invoice**
4. PDF will download AND an email will be sent to:
   - The student's email address
   - BCC copy to info@planbeta.in

## Troubleshooting

### Email not sending?

1. **Check Outlook SMTP settings:**
   - Make sure the email `info@planbeta.in` can send via SMTP
   - Outlook might require "App Password" instead of regular password
   - Go to https://account.microsoft.com/security → App passwords

2. **Check Vercel logs:**
   - In Vercel dashboard → Functions → Click on latest invocation
   - Look for error messages

3. **Test SMTP credentials locally:**
   ```bash
   npm run dev
   # Fill form and try to send
   # Check browser console for errors
   ```

### Creating an Outlook App Password (if regular password doesn't work)

1. Go to https://account.microsoft.com/security
2. Click "Security" → "App passwords"
3. Create a new app password
4. Update the `OUTLOOK_PASSWORD` environment variable in Vercel with this app password

## Current Deployment

Your app is automatically deployed to Vercel when you push to the `main` branch.

**Live URL:** Check your Vercel dashboard for the deployment URL
