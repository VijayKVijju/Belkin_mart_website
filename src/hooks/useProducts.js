import { useProductStore } from '../store/productStore'

export function useProducts() {
  const {
    products,
    categories,
    featuredProducts,
    loading,
    error,
    currentPage,
    totalPages,
    filters,
    fetchProducts,
    fetchProductBySlug,
    fetchCategories,
    fetchFeaturedProducts,
    setFilters,
    clearFilters,
    nextPage,
    prevPage
  } = useProductStore()

  return {
    products,
    categories,
    featuredProducts,
    loading,
    error,
    currentPage,
    totalPages,
    filters,
    fetchProducts,
    fetchProductBySlug,
    fetchCategories,
    fetchFeaturedProducts,
    setFilters,
    clearFilters,
    nextPage,
    prevPage
  }
}