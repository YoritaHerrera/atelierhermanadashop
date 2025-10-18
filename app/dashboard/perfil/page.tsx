import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { LogOut } from "lucide-react"

async function signOut() {
  "use server"
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  redirect("/auth/login")
}

export default async function ProfilePage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif text-4xl mb-2 text-balance">Mi Perfil</h1>
        <p className="text-muted-foreground">Gestiona tu información personal</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Cuenta</CardTitle>
            <CardDescription>Detalles de tu cuenta en Atelier Hermanada</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email || ""} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Tu dirección de correo electrónico no se puede cambiar</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-id">ID de Usuario</Label>
              <Input id="user-id" value={user.id} disabled className="bg-muted font-mono text-xs" />
            </div>

            <div className="space-y-2">
              <Label>Fecha de Registro</Label>
              <Input
                value={new Date(user.created_at).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                disabled
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle>Cerrar Sesión</CardTitle>
            <CardDescription>Salir de tu cuenta de Atelier Hermanada</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={signOut}>
              <Button type="submit" variant="destructive" className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
