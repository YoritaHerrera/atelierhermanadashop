import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata = {
  title: "Sobre nosotros | Atelier Hermanada",
  description: "Conoce la historia detrás de las creaciones artesanales de Atelier Hermanada.",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border/40 bg-card/30 py-16">
          <div className="container max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary">Nuestra historia</p>
            <h1 className="font-serif text-4xl font-bold md:text-5xl">Creaciones del alma</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Atelier Hermanada nace del deseo de convertir materiales sencillos en piezas con significado. Cada bordado,
              cerámica y accesorio se crea a mano, con calma y mucho cariño.
            </p>
          </div>
        </section>
        <section className="container max-w-3xl py-14">
          <h2 className="font-serif text-2xl font-semibold">Piezas para acompañarte</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Diseñamos objetos únicos inspirados en la magia, la naturaleza y los pequeños rituales cotidianos. Gracias por
            apoyar el trabajo artesanal y formar parte de esta comunidad.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
