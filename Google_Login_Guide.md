# Google Login Implementation Guide for ChatKro

## Overview
This guide will walk you through implementing Google OAuth authentication in your React ChatKro application using Google's official libraries.

## Prerequisites
- Node.js and npm installed
- React application setup (already done)
- Google Developer Console access

---

## Step 1: Google Cloud Console Setup

### 1.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `ChatKro-Auth`
4. Click "Create"

### 1.2 Enable Google+ API
1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API" and enable it
3. Also enable "Google Identity" API

### 1.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. If prompted, configure OAuth consent screen:
   - User Type: External
   - App name: ChatKro
   - User support email: your email
   - Developer contact: your email
4. Application type: Web application
5. Name: ChatKro Web Client
6. Authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - `http://localhost:3000` (alternative)
7. Authorized redirect URIs:
   - `http://localhost:5173/auth/google/callback`
8. Click "Create"
9. **IMPORTANT**: Copy the Client ID (you'll need this)

---

## Step 2: Install Required Dependencies

Open terminal in your client directory and run:

```bash
npm install @google-cloud/local-auth google-auth-library jwt-decode
```

Or if you prefer yarn:

```bash
yarn add @google-cloud/local-auth google-auth-library jwt-decode
```

---

## Step 3: Environment Variables Setup

### 3.1 Create Environment File
Create a `.env` file in your client root directory:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_API_URL=http://localhost:8000/api
```

### 3.2 Update .gitignore
Add to your `.gitignore` file:
```
.env
.env.local
.env.development
.env.production
```

---

## Step 4: Create Google Auth Service

---

## Step 5: Create Auth Context

## Step 6: Update Main App Component

## Step 7: Update Login Page

## Step 9: Create Backend API Endpoints

## Step 10: Testing

### 10.1 Test Steps
1. Start your development server: `npm run dev`
2. Navigate to login page
3. Click "Continue with Google"
4. Complete Google OAuth flow
5. Verify successful login and redirect

### 10.2 Common Issues
- **CORS errors**: Ensure your backend allows your frontend domain
- **Client ID errors**: Double-check your Google Client ID in .env
- **Redirect URI mismatch**: Ensure URLs match in Google Console

---

## Step 11: Production Deployment

### 11.1 Update Google Console
1. Add your production domain to authorized origins
2. Add production redirect URIs
3. Update environment variables on your hosting platform

### 11.2 Security Considerations
- Never expose client secrets in frontend
- Validate ID tokens on backend
- Implement proper session management
- Use HTTPS in production

---

## Troubleshooting

### Common Errors:
1. **"API key not valid"**: Check your Google Client ID
2. **"Redirect URI mismatch"**: Verify URLs in Google Console
3. **"Network Error"**: Check CORS settings
4. **"Invalid token"**: Verify backend token validation

### Debug Steps:
1. Check browser console for errors
2. Verify network requests in DevTools
3. Test with different browsers
4. Check backend logs

---

## Conclusion

You now have a complete Google OAuth implementation for your ChatKro application! Users can sign in with their Google accounts seamlessly.

Remember to:
- Keep your credentials secure
- Test thoroughly before deployment
- Monitor for any authentication issues
- Update dependencies regularly

For additional help, refer to:
- [Google OAuth Documentation](https://developers.google.com/identity/oauth2/web/guides/overview)
- [React Auth Best Practices](https://react.dev/reference/react/useContext)