import { useState } from 'react'
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function ProductFilter({ onFilterChange, categories = [] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    condition: '',
    sortBy: 'newest',
  })

  const priceRanges = [
    { label: 'Under ₹500', value: '0-500' },
    { label: '₹500 - ₹1000', value: '500-1000' },
    { label: '₹1000 - ₹5000', value: '1000-5000' },
    { label: '₹5000 - ₹10000', value: '5000-10000' },
    { label: 'Above ₹10000', value: '10000-999999' },
  ]

  const conditions = [
    { label: 'New', value: 'new' },
    { label: 'Refurbished', value: 'refurbished' },
    { label: 'Used', value: 'used' },
  ]

  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Most Popular', value: 'popular' },
  ]

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const defaultFilters = {
      category: '',
      priceRange: '',
      condition: '',
      sortBy: 'newest',
    }
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  const activeFilterCount = Object.values(filters).filter(v => v && v !== 'newest').length

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full flex items-center justify-between p-4 font-semibold"
      >
        <span className="flex items-center gap-2">
          <FunnelIcon className="w-5 h-5" />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </span>
        <XMarkIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-0' : 'rotate-90'}`} />
      </button>

      {/* Filter Content */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block p-4 space-y-6`}>
        {/* Sort By */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Category
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={filters.category === ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="ml-2 text-sm text-gray-700">All Categories</span>
              </label>
              {categories.map((category) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category.slug}
                    checked={filters.category === category.slug}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Price Range */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Price Range
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="priceRange"
                value=""
                checked={filters.priceRange === ''}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="w-4 h-4 text-indigo-600"
              />
              <span className="ml-2 text-sm text-gray-700">Any Price</span>
            </label>
            {priceRanges.map((range) => (
              <label key={range.value} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  value={range.value}
                  checked={filters.priceRange === range.value}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="ml-2 text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Condition
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="condition"
                value=""
                checked={filters.condition === ''}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
                className="w-4 h-4 text-indigo-600"
              />
              <span className="ml-2 text-sm text-gray-700">All Conditions</span>
            </label>
            {conditions.map((condition) => (
              <label key={condition.value} className="flex items-center">
                <input
                  type="radio"
                  name="condition"
                  value={condition.value}
                  checked={filters.condition === condition.value}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="ml-2 text-sm text-gray-700">{condition.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  )
}