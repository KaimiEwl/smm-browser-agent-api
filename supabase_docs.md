### Session Management and Auth State Monitoring - TypeScript

Source: https://context7.com/supabase/supabase-js/llms.txt

Retrieve current user and session, refresh tokens, set sessions from tokens, sign out (single or all devices), and listen for authentication state changes. Provides real-time auth event monitoring with cleanup via subscription unsubscribe.

```typescript
// Get current session
const { data: { session }, error } = await supabase.auth.getSession()

// Get current user
const { data: { user }, error } = await supabase.auth.getUser()

// Refresh session
const { data, error } = await supabase.auth.refreshSession()

// Set session from tokens
const { data, error } = await supabase.auth.setSession({
  access_token: 'eyJ...',
  refresh_token: 'abc...'
})

// Sign out current device
const { error } = await supabase.auth.signOut()

// Sign out all devices
const { error } = await supabase.auth.signOut({ scope: 'global' })

// Listen for auth state changes
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    console.log('Auth event:', event)
    // Events: 'SIGNED_IN', 'SIGNED_OUT', 'TOKEN_REFRESHED', 'USER_UPDATED', 'PASSWORD_RECOVERY'

    if (event === 'SIGNED_IN') {
      console.log('User signed in:', session?.user)
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out')
    }
  }
)

// Cleanup listener
subscription.unsubscribe()
```

--------------------------------

### User Sign In with Multiple Authentication Methods - TypeScript

Source: https://context7.com/supabase/supabase-js/llms.txt

Authenticate users via email/password, magic links (passwordless), phone OTP, and OAuth providers (Google, etc.). Supports custom redirect URLs, scopes, and query parameters. Returns session with access/refresh tokens and user information.

```typescript
// Sign in with email and password
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securepassword123'
})

// Sign in with magic link (passwordless)
const { data, error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    emailRedirectTo: 'https://yourapp.com/auth/callback'
  }
})

// Sign in with phone OTP
const { data, error } = await supabase.auth.signInWithOtp({
  phone: '+1234567890'
})

// Verify OTP
const { data, error } = await supabase.auth.verifyOtp({
  phone: '+1234567890',
  token: '123456',
  type: 'sms'
})

// Sign in with OAuth provider
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://yourapp.com/auth/callback',
    scopes: 'email profile',
    queryParams: {
      access_type: 'offline',
      prompt: 'consent'
    }
  }
})
```

--------------------------------

### Manage User Authentication with Supabase JS Client

Source: https://context7.com/supabase/supabase-js/llms.txt

This snippet demonstrates how to update user profiles, change email or password, request password resets, and resend email confirmations using the Supabase `auth` module. It covers common user management operations, returning data and error objects upon completion.

```typescript
// Update user email
const { data, error } = await supabase.auth.updateUser({
  email: 'newemail@example.com'
})

// Update user password
const { data, error } = await supabase.auth.updateUser({
  password: 'newSecurePassword123'
})

// Update user metadata
const { data, error } = await supabase.auth.updateUser({
  data: {
    first_name: 'Jane',
    avatar_url: 'https://example.com/avatar.png',
    preferences: { theme: 'dark', notifications: true }
  }
})

// Request password reset
const { data, error } = await supabase.auth.resetPasswordForEmail(
  'user@example.com',
  { redirectTo: 'https://yourapp.com/reset-password' }
)

// Resend email confirmation
const { data, error } = await supabase.auth.resend({
  type: 'signup',
  email: 'user@example.com'
})

// Response:
// {
//   "data": {
//     "user": { "id": "uuid", "email": "newemail@example.com", ... }
//   },
//   "error": null
}
```

--------------------------------

### POST /auth/v1/token

Source: https://context7.com/supabase/supabase-js/llms.txt

Authenticates users with various methods including email/password, magic link, phone OTP, and OAuth providers. Returns a session containing access and refresh tokens.

```APIDOC
## POST /auth/v1/token

### Description
Authenticates a user and issues a session with access and refresh tokens. Supports authentication via email/password, magic link (OTP to email), phone OTP, and various OAuth providers.

### Method
POST

### Endpoint
/auth/v1/token

### Parameters
#### Request Body
- **email** (string) - Optional - The user's email address for password-based or magic link sign-in.
- **password** (string) - Optional - The user's password for email/password sign-in.
- **phone** (string) - Optional - The user's phone number for OTP sign-in.
- **token** (string) - Optional - The OTP token received by email or SMS for verification.
- **type** (string) - Optional - The type of OTP verification ('sms' or 'email').
- **provider** (string) - Optional - The OAuth provider to use (e.g., 'google', 'github').
- **options** (object) - Optional - Additional sign-in options.
  - **emailRedirectTo** (string) - Optional - URL for email magic link redirection.
  - **redirectTo** (string) - Optional - URL for OAuth callback redirection.
  - **scopes** (string) - Optional - OAuth scopes requested.
  - **queryParams** (object) - Optional - Additional query parameters for OAuth.

### Request Example
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

### Response
#### Success Response (200)
- **data** (object) - Contains user and session information.
  - **user** (object) - The authenticated user object, including `id`, `email`, etc.
  - **session** (object) - The user's session object.
    - **access_token** (string) - JWT access token for authenticated requests.
    - **refresh_token** (string) - Token used to obtain new access tokens.
    - **expires_in** (number) - Lifetime of the access token in seconds.
- **error** (object | null) - Contains error details if authentication failed.

#### Response Example
```json
{
  "data": {
    "user": { "id": "uuid", "email": "user@example.com" },
    "session": {
      "access_token": "eyJ...",
      "refresh_token": "abc...",
      "expires_in": 3600
    }
  },
  "error": null
}
```
```

--------------------------------

### POST /auth/v1/signup

Source: https://context7.com/supabase/supabase-js/llms.txt

Creates a new user account with email/password or phone/password credentials. Supports email confirmation, custom user metadata, and automatic session creation.

```APIDOC
## POST /auth/v1/signup

### Description
Registers a new user in the authentication system. Users can sign up using an email and password, or a phone number and password. Custom metadata can be attached to the user profile.

### Method
POST

### Endpoint
/auth/v1/signup

### Parameters
#### Request Body
- **email** (string) - Optional - The user's email address. Required if `phone` is not provided.
- **password** (string) - Required - The user's chosen password.
- **phone** (string) - Optional - The user's phone number. Required if `email` is not provided.
- **options** (object) - Optional - Additional signup options.
  - **emailRedirectTo** (string) - Optional - A URL to redirect the user to after email confirmation.
  - **data** (object) - Optional - Custom metadata to store with the user profile.

### Request Example
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "options": {
    "emailRedirectTo": "https://yourapp.com/welcome",
    "data": {
      "first_name": "John",
      "last_name": "Doe",
      "age": 25
    }
  }
}
```

### Response
#### Success Response (200)
- **data** (object) - Contains user and session information.
  - **user** (object) - The newly created user object, including `id`, `email`, etc.
  - **session** (object | null) - The user's session object if created immediately, otherwise `null` (e.g., if email confirmation is required).
- **error** (object | null) - Contains error details if the signup failed.

#### Response Example
```json
{
  "data": {
    "user": { "id": "uuid", "email": "user@example.com" },
    "session": null
  },
  "error": null
}
```
```