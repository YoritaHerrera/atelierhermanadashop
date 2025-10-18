"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function toggleFavorite(productId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Debes iniciar sesión para agregar favoritos" }
  }

  // Check if already favorited
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single()

  if (existing) {
    // Remove from favorites
    const { error } = await supabase.from("favorites").delete().eq("id", existing.id)

    if (error) {
      return { error: "Error al eliminar de favoritos" }
    }

    revalidatePath("/favoritos")
    return { success: true, action: "removed" }
  } else {
    // Add to favorites
    const { error } = await supabase.from("favorites").insert({
      user_id: user.id,
      product_id: productId,
    })

    if (error) {
      return { error: "Error al agregar a favoritos" }
    }

    revalidatePath("/favoritos")
    return { success: true, action: "added" }
  }
}

export async function getFavorites() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data: favorites } = await supabase
    .from("favorites")
    .select("*, product:products(id, name, slug, price, image_url, stock, material:materials(name))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return favorites || []
}

export async function isFavorite(productId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single()

  return !!data
}

export async function createSharedWishlist(name: string, description: string, productIds: string[]) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Debes iniciar sesión" }
  }

  // Generate unique share token
  const shareToken = crypto.randomUUID()

  // Create wishlist
  const { data: wishlist, error: wishlistError } = await supabase
    .from("shared_wishlists")
    .insert({
      user_id: user.id,
      share_token: shareToken,
      name,
      description,
    })
    .select()
    .single()

  if (wishlistError || !wishlist) {
    return { error: "Error al crear lista de deseos" }
  }

  // Add products to wishlist
  if (productIds.length > 0) {
    const items = productIds.map((productId) => ({
      wishlist_id: wishlist.id,
      product_id: productId,
    }))

    const { error: itemsError } = await supabase.from("wishlist_items").insert(items)

    if (itemsError) {
      return { error: "Error al agregar productos a la lista" }
    }
  }

  revalidatePath("/dashboard/listas")
  return { success: true, shareToken }
}

export async function getSharedWishlist(shareToken: string) {
  const supabase = await createClient()

  const { data: wishlist } = await supabase
    .from("shared_wishlists")
    .select("*, profile:profiles(full_name)")
    .eq("share_token", shareToken)
    .eq("is_active", true)
    .single()

  if (!wishlist) {
    return null
  }

  const { data: items } = await supabase
    .from("wishlist_items")
    .select("*, product:products(id, name, slug, price, image_url, stock)")
    .eq("wishlist_id", wishlist.id)

  return { ...wishlist, items: items || [] }
}

export async function getUserWishlists() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data: wishlists } = await supabase
    .from("shared_wishlists")
    .select("*, items:wishlist_items(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return wishlists || []
}

export async function markWishlistItemPurchased(itemId: string, purchasedBy: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("wishlist_items")
    .update({
      is_purchased: true,
      purchased_by: purchasedBy,
    })
    .eq("id", itemId)

  if (error) {
    return { error: "Error al marcar como comprado" }
  }

  return { success: true }
}
