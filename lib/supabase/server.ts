class QueryBuilder {
  private supabaseUrl: string
  private supabaseKey: string
  private table: string
  private columns = "*"
  private filters: Array<{ column: string; operator: string; value: any }> = []
  private orderBy: { column: string; ascending: boolean } | null = null
  private limitValue: number | null = null
  private singleRow = false

  constructor(supabaseUrl: string, supabaseKey: string, table: string) {
    this.supabaseUrl = supabaseUrl
    this.supabaseKey = supabaseKey
    this.table = table
  }

  select(columns = "*") {
    this.columns = columns
    return this
  }

  eq(column: string, value: any) {
    this.filters.push({ column, operator: "eq", value })
    return this
  }

  ilike(column: string, value: any) {
    this.filters.push({ column, operator: "ilike", value })
    return this
  }

  order(column: string, options: { ascending: boolean } = { ascending: true }) {
    this.orderBy = { column, ascending: options.ascending }
    return this
  }

  limit(n: number) {
    this.limitValue = n
    return this
  }

  single() {
    this.singleRow = true
    return this
  }

  private buildUrl() {
    let url = `${this.supabaseUrl}/rest/v1/${this.table}?select=${this.columns}`

    // Add filters
    for (const filter of this.filters) {
      if (filter.operator === "eq") {
        url += `&${filter.column}=eq.${encodeURIComponent(filter.value)}`
      } else if (filter.operator === "ilike") {
        url += `&${filter.column}=ilike.${encodeURIComponent(filter.value)}`
      }
    }

    // Add ordering
    if (this.orderBy) {
      const direction = this.orderBy.ascending ? "asc" : "desc"
      url += `&order=${this.orderBy.column}.${direction}`
    }

    // Add limit
    if (this.limitValue) {
      url += `&limit=${this.limitValue}`
    } else if (this.singleRow) {
      url += `&limit=1`
    }

    return url
  }

  async then(callback?: any) {
    const url = this.buildUrl()
    const response = await fetch(url, {
      headers: {
        apikey: this.supabaseKey,
        Authorization: `Bearer ${this.supabaseKey}`,
      },
    })

    const data = await response.json()

    if (this.singleRow) {
      return { data: data[0] || null, error: null }
    }

    return { data, error: null }
  }
}

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return {
    from: (table: string) => new QueryBuilder(supabaseUrl, supabaseKey, table),
  }
}

export const createServerClient = createClient
