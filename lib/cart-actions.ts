"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addToCart(productId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Debes iniciar sesión para agregar productos al carrito" }
  }

  // Check if item already exists in cart
  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single()

  if (existingItem) {
    // Update quantity
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existingItem.quantity + 1 })
      .eq("id", existingItem.id)

    if (error) {
      return { error: "Error al actualizar el carrito" }
    }
  } else {
    // Add new item
    const { error } = await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: productId,
      quantity: 1,
    })

    if (error) {
      return { error: "Error al agregar al carrito" }
    }
  }

  revalidatePath("/carrito")
  return { success: true }
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "No autorizado" }
  }

  if (quantity <= 0) {
    return removeFromCart(itemId)
  }

  const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", itemId).eq("user_id", user.id)

  if (error) {
    return { error: "Error al actualizar cantidad" }
  }

  revalidatePath("/carrito")
  return { success: true }
}

export async function removeFromCart(itemId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "No autorizado" }
  }

  const { error } = await supabase.from("cart_items").delete().eq("id", itemId).eq("user_id", user.id)

  if (error) {
    return { error: "Error al eliminar del carrito" }
  }

  revalidatePath("/carrito")
  return { success: true }
}

export async function getCartItems() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { items: [], total: 0 }
  }

  const { data: cartItems } = await supabase
    .from("cart_items")
    .select("*, product:products(id, name, slug, price, image_url, stock)")
    .eq("user_id", user.id)

  if (!cartItems) {
    return { items: [], total: 0 }
  }

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity
  }, 0)

  return { items: cartItems, total }
}

export async function getCartCount() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return 0
  }

  const { data: cartItems } = await supabase.from("cart_items").select("quantity").eq("user_id", user.id)

  if (!cartItems) {
    return 0
  }

  return cartItems.reduce((sum, item) => sum + item.quantity, 0)
}
