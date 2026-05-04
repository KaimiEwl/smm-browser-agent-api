import { createClient } from '@supabase/supabase-js'

// Initialize the Supabase client (using dummy values for the example)
const supabaseUrl = 'https://xyzcompany.supabase.co'
const supabaseKey = 'public-anon-key'
const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Example function demonstrating Supabase Auth usage
 * strictly based on the Context7 MCP documentation.
 */
async function authenticateUser() {
    // 1. Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'user@example.com',
        password: 'securepassword123'
    })

    if (error) {
        console.error('Sign in error:', error.message)
        return
    }
    console.log('User signed in successfully:', data.user?.email)

    // 2. Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (session) {
        console.log('Active session token:', session.access_token)
    }

    // 3. Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, currentSession) => {
            console.log('Auth event triggered:', event)
            if (event === 'SIGNED_IN') {
                console.log('State changed: User signed in ->', currentSession?.user?.email)
            } else if (event === 'SIGNED_OUT') {
                console.log('State changed: User signed out')
            }
        }
    )

    // 4. Sign out current device
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) {
        console.error('Error signing out:', signOutError.message)
    } else {
        console.log('Successfully signed out')
    }

    // 5. Cleanup listener
    subscription.unsubscribe()
}

authenticateUser()
