"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, Heart, List, User } from "lucide-react"

const navItems = [
  {
    title: "Resumen",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Pedidos",
    href: "/dashboard/pedidos",
    icon: Package,
  },
  {
    title: "Favoritos",
    href: "/favoritos",
    icon: Heart,
  },
  {
    title: "Listas",
    href: "/dashboard/listas",
    icon: List,
  },
  {
    title: "Perfil",
    href: "/dashboard/perfil",
    icon: User,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border mb-8">
      <div className="container mx-auto px-4">
        <div className="flex gap-6 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap",
                  isActive
                    ? "border-mystical-purple text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.title}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
