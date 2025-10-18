import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-serif">Algo salió mal</CardTitle>
          </CardHeader>
          <CardContent>
            {params?.error ? (
              <p className="text-center text-sm text-muted-foreground">Error: {params.error}</p>
            ) : (
              <p className="text-center text-sm text-muted-foreground">Ocurrió un error inesperado.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
