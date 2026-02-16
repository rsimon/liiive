# Social Login Configuration

liiive uses **Supabase Auth** for authentication and currently supports social login via **GitHub** and **Google**.

When running Supabase in a self-hosted setup, social login is configured through environment variables. This means you must:

- Register OAuth applications with GitHub and Google
- Obtain or create the relevant credentials
- Configure these credentials in the main Supabase environment file

**Before you start**, make sure that you have a running liiive deployment (development or production).

## 1. How Social Login Works

When a user logs in to liiive using a social provider:

- The browser first redirects to the provider’s OAuth login page (GitHub or Google)
- After successful authentication, the provider redirects back to your self-hosted Supabase instance
- Supabase completes the login and redirects the user back to the liiive client

All OAuth handling happens inside Supabase. The liiive client only initiates the login and receives the authenticated session.

## 2. Configure Supabase

You must create OAuth applications that represent your liiive deployment with each provider.

### 2.1 GitHub

1. Go to **GitHub → Settings → Developer Settings → OAuth Apps**

2. Create a new OAuth app

3. Set:
   - A name (e.g. "liiive")
   - Homepage URL (e.g. `https://app.my-liiive.org`; `http://localhost:4321` is also valid for development)
   - Authorization callback URL: `https://api.my-liiive.org/auth/v1/callback`

4. After creating the app, note the **Client ID** 

5. Create a **Client Secret** and note it.

6. Edit your `supabase/docker/.env` file and update the GitHub credentials:

   ```sh
   GOTRUE_EXTERNAL_GITHUB_ENABLED=true
   GOTRUE_EXTERNAL_GITHUB_CLIENT_ID=my-gh-client-id
   GOTRUE_EXTERNAL_GITHUB_SECRET=my-gh-client-secret
   GOTRUE_EXTERNAL_GITHUB_REDIRECT_URI=https://api.my-liiive.org/auth/v1/callback
   ```

### 2.2 Google

1. Go to **Google Cloud Console**

2. Create or select a project

3. Go to **APIs and Services → Credentials**

4. Create a new **OAuth-Client-ID** → Application type "Web application"
   - Give it a name (e.g. "liiive.now")
   - Add your liiive client URL as an **Authorized JavaScript origin** (e.g. `https://app.my-liiive.org`)
   - Add the redirect URL: `https://api.my-liiive.org/auth/v1/callback`
   
5. Note the **Client ID** 

6. Create a **Client Secret** and note it.

7. Edit your `supabase/docker/.env` file and update the Google credentials:

   ```sh
   GOTRUE_EXTERNAL_GOOGLE_ENABLED=true
   GOTRUE_EXTERNAL_GOOGLE_CLIENT_ID=my-google-client-id
   GOTRUE_EXTERNAL_GOOGLE_SECRET=my-google-client-secret
   GOTRUE_EXTERNAL_GOOGLE_REDIRECT_URI=https://api.my-liiive.org/auth/v1/callback
   ```
