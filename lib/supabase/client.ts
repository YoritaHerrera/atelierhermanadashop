export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return {
    from: (table: string) => ({
      select: (columns = "*") => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${column}=eq.${value}&select=${columns}`, {
              headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`,
              },
            })
            const data = await response.json()
            return { data: data[0], error: null }
          },
          limit: (n: number) => ({
            then: async (callback: any) => {
              const response = await fetch(
                `${supabaseUrl}/rest/v1/${table}?${column}=eq.${value}&select=${columns}&limit=${n}`,
                {
                  headers: {
                    apikey: supabaseKey,
                    Authorization: `Bearer ${supabaseKey}`,
                  },
                },
              )
              const data = await response.json()
              return callback({ data, error: null })
            },
          }),
        }),
        limit: (n: number) => ({
          then: async (callback: any) => {
            const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=${columns}&limit=${n}`, {
              headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`,
              },
            })
            const data = await response.json()
            return callback({ data, error: null })
          },
        }),
        then: async (callback: any) => {
          const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=${columns}`, {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
          })
          const data = await response.json()
          return callback({ data, error: null })
        },
      }),
    }),
    auth: {
      signInWithPassword: async (credentials: { email: string; password: string }) => {
        const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
          method: "POST",
          headers: {
            apikey: supabaseKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        })
        const data = await response.json()
        if (data.error) {
          return { error: new Error(data.error_description || data.error) }
        }
        // Store token in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("sb-auth-token", data.access_token)
        }
        return { error: null }
      },
      signUp: async (credentials: { email: string; password: string; options?: any }) => {
        const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
          method: "POST",
          headers: {
            apikey: supabaseKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            ...credentials.options,
          }),
        })
        const data = await response.json()
        if (data.error) {
          return { error: new Error(data.error_description || data.error) }
        }
        return { error: null }
      },
      getUser: async (token?: string) => {
        const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("sb-auth-token") : null)
        if (!authToken) {
          return { data: { user: null }, error: null }
        }
        const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${authToken}`,
          },
        })
        const data = await response.json()
        return { data: { user: data }, error: null }
      },
      signOut: async () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("sb-auth-token")
        }
        return { error: null }
      },
    },
  }
}
