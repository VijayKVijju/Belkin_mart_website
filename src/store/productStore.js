import { create } from 'zustand'
import { productService } from '../services/productService'

export const useProductStore = create((set, get) => ({
  products: [],
  categories: [],
  featuredProducts: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  filters: {
    category: '',
    search: '',
    priceRange: '',
    condition: '',
    sortBy: 'newest'
  },

  // Fetch products with filters
  fetchProducts: async (page = 1, limit = 20) => {
    set({ loading: true, error: null })
    try {
      const { filters } = get()
      const result = await productService.getProducts({
        page,
        limit,
        ...filters
      })

      set({
        products: result.products,
        currentPage: result.page,
        totalPages: result.totalPages,
        loading: false
      })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // Fetch single product
  fetchProductBySlug: async (slug) => {
    set({ loading: true, error: null })
    try {
      const product = await productService.getProductBySlug(slug)
      set({ loading: false })
      return product
    } catch (error) {
      set({ error: error.message, loading: false })
      return null
    }
  },

  // Fetch categories
  fetchCategories: async () => {
    try {
      const categories = await productService.getCategories()
      set({ categories })
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  },

  // Fetch featured products
  fetchFeaturedProducts: async (limit = 8) => {
    try {
      const products = await productService.getFeaturedProducts(limit)
      set({ featuredProducts: products })
    } catch (error) {
      console.error('Error fetching featured products:', error)
    }
  },

  // Update filters
  setFilters: (newFilters) => {
    set({ filters: { ...get().filters, ...newFilters } })
    get().fetchProducts(1)
  },

  // Clear filters
  clearFilters: () => {
    set({
      filters: {
        category: '',
        search: '',
        priceRange: '',
        condition: '',
        sortBy: 'newest'
      }
    })
    get().fetchProducts(1)
  },

  // Go to next page
  nextPage: () => {
    const { currentPage, totalPages } = get()
    if (currentPage < totalPages) {
      get().fetchProducts(currentPage + 1)
    }
  },

  // Go to previous page
  prevPage: () => {
    const { currentPage } = get()
    if (currentPage > 1) {
      get().fetchProducts(currentPage - 1)
    }
  }
}))