import { supabase } from '../lib/supabase'

export const productService = {
  getProducts: async ({ page = 1, limit = 20, category, search, sort }) => {
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        vendor:vendors(*),
        images:product_images(*),
        reviews:reviews(rating)
      `, { count: 'exact' })
      .eq('is_active', true)

    if (category) {
      query = query.eq('category_id', category)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (sort === 'price_asc') {
      query = query.order('price', { ascending: true })
    } else if (sort === 'price_desc') {
      query = query.order('price', { ascending: false })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query.range(from, to)

    if (error) throw error

    return {
      products: data,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    }
  },

  getProductById: async (id) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        vendor:vendors(*),
        images:product_images(*),
        variants:product_variants(*),
        reviews:reviews(*, user:profiles(full_name, avatar_url))
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  getCategories: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order')

    if (error) throw error
    return data
  },

  getFeaturedProducts: async (limit = 8) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*)
      `)
      .eq('is_featured', true)
      .eq('is_active', true)
      .limit(limit)

    if (error) throw error
    return data
  }
}
