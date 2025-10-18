import { getCartCount } from "@/lib/cart-actions"
import { Badge } from "@/components/ui/badge"

export async function CartCountBadge() {
  const count = await getCartCount()

  if (count === 0) return null

  return (
    <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs" variant="secondary">
      {count}
    </Badge>
  )
}
