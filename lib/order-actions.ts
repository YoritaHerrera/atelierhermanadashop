"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

type ShippingAddress = {
  fullName: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
}

export async function createOrder(shippingAddress: ShippingAddress, discountCodeId?: string, discountAmount?: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Debes iniciar sesión" }
  }

  // Get cart items
  const { data: cartItems } = await supabase
    .from("cart_items")
    .select("*, product:products(id, name, price, stock)")
    .eq("user_id", user.id)

  if (!cartItems || cartItems.length === 0) {
    return { error: "Tu carrito está vacío" }
  }

  // Check stock availability
  for (const item of cartItems) {
    if (!item.product || item.product.stock < item.quantity) {
      return { error: `Stock insuficiente para ${item.product?.name}` }
    }
  }

  // Calculate total
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity
  }, 0)

  const total = subtotal - (discountAmount || 0)

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total,
      discount_code_id: discountCodeId || null,
      discount_amount: discountAmount || 0,
      status: "pending",
      shipping_address: shippingAddress,
    })
    .select()
    .single()

  if (orderError || !order) {
    return { error: "Error al crear la orden" }
  }

  // Create order items
  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product!.id,
    quantity: item.quantity,
    price: item.product!.price,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

  if (itemsError) {
    return { error: "Error al crear los items de la orden" }
  }

  // Update product stock
  for (const item of cartItems) {
    const { error: stockError } = await supabase
      .from("products")
      .update({ stock: item.product!.stock - item.quantity })
      .eq("id", item.product!.id)

    if (stockError) {
      console.error("Error updating stock:", stockError)
    }
  }

  // Update discount code usage
  if (discountCodeId) {
    const { error: discountError } = await supabase.rpc("increment_discount_usage", {
      discount_id: discountCodeId,
    })

    if (discountError) {
      console.error("Error updating discount usage:", discountError)
    }
  }

  // Clear cart
  await supabase.from("cart_items").delete().eq("user_id", user.id)

  revalidatePath("/carrito")
  revalidatePath("/dashboard/pedidos")

  return { success: true, orderId: order.id }
}

export async function getUserOrders() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*, items:order_items(*, product:products(name, image_url))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return orders || []
}

export async function getOrderById(orderId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: order } = await supabase
    .from("orders")
    .select("*, items:order_items(*, product:products(name, image_url, slug)), discount:discount_codes(code)")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single()

  return order
}
