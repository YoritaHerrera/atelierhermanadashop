export async function createClient() {
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
  }
}

export const createServerClient = createClient
