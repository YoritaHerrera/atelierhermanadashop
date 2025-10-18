"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Share2, Copy, Check } from "lucide-react"
import { createSharedWishlist } from "@/lib/favorites-actions"
import { toast } from "@/hooks/use-toast"

export function CreateWishlistDialog({ favorites }: { favorites: string[] }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) {
      toast({ title: "Por favor ingresa un nombre para la lista", variant: "destructive" })
      return
    }

    setIsLoading(true)
    const result = await createSharedWishlist(name, description, favorites)

    if (result.error) {
      toast({ title: result.error, variant: "destructive" })
    } else if (result.shareToken) {
      const url = `${window.location.origin}/lista/${result.shareToken}`
      setShareUrl(url)
      toast({ title: "Lista creada exitosamente" })
    }

    setIsLoading(false)
  }

  const handleCopy = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast({ title: "Enlace copiado al portapapeles" })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setName("")
    setDescription("")
    setShareUrl(null)
    setCopied(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share2 className="mr-2 h-4 w-4" />
          Crear Lista para Regalar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {!shareUrl ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif">Crear Lista de Deseos</DialogTitle>
              <DialogDescription>
                Crea una lista compartible para que otros puedan ver tus productos favoritos y regalártelos
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la lista</Label>
                <Input
                  id="name"
                  placeholder="Ej: Mi Lista de Cumpleaños"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe tu lista..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Se incluirán {favorites.length} {favorites.length === 1 ? "producto" : "productos"} de tus favoritos
              </p>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate} disabled={isLoading}>
                {isLoading ? "Creando..." : "Crear Lista"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif">Lista Creada</DialogTitle>
              <DialogDescription>Comparte este enlace para que otros puedan ver tu lista</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button size="icon" variant="outline" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>Cerrar</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
