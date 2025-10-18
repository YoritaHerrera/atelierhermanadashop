import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-serif">¡Gracias por registrarte!</CardTitle>
            <CardDescription>Verifica tu correo electrónico</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-muted-foreground">
              Te hemos enviado un correo de confirmación. Por favor, revisa tu bandeja de entrada y confirma tu cuenta
              antes de iniciar sesión.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
