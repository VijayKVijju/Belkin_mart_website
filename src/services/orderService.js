import { supabase } from '../lib/supabase'

export const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get user orders
  getUserOrders: async (userId) => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        ),
        user:profiles(*)
      `)
      .eq('id', orderId)
      .single()

    if (error) throw error
    return data
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get vendor orders
  getVendorOrders: async (vendorId) => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        ),
        user:profiles(*)
      `)
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Calculate order totals
  calculateOrderTotals: (items) => {
    const subtotal = items.reduce((total, item) => {
      const price = item.product.discount_price || item.product.price
      return total + (price * item.quantity)
    }, 0)

    const shipping = subtotal > 500 ? 0 : 50
    const tax = subtotal * 0.18 // 18% GST
    const total = subtotal + shipping + tax

    return {
      subtotal,
      shipping,
      tax,
      total
    }
  },

  // Generate order number
  generateOrderNumber: () => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 10000)
    return `ORD-${timestamp}-${random}`
  }
}