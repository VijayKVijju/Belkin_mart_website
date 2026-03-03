import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline'
import { supabase } from '../../supabaseClient'

const DEBOUNCE_MS = 300
const MAX_SUGGESTIONS = 8
const MAX_HISTORY = 6
const HISTORY_KEY = 'belkinmart_search_history'

const debugLog = (label, data, isError = false) => {
  if (isError) {
    console.error(`[SEARCHBAR ERROR] ${label}:`, data)
  } else {
    console.log(`[SEARCHBAR] ${label}:`, data)
  }
}

function getHistory() {
  try { return JSON.parse(sessionStorage.getItem(HISTORY_KEY) || '[]') } catch { return [] }
}

function saveHistory(term) {
  if (!term.trim()) return
  try {
    const prev = getHistory().filter(h => h.toLowerCase() !== term.toLowerCase())
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify([term.trim(), ...prev].slice(0, MAX_HISTORY)))
  } catch {}
}

function removeHistory(term) {
  try {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(getHistory().filter(h => h !== term)))
  } catch {}
}

function highlight(text, q) {
  if (!q.trim()) return text
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  return parts.map((p, i) =>
    p.toLowerCase() === q.toLowerCase()
      ? <mark key={i} className="bg-orange-100 text-orange-700 font-semibold not-italic rounded px-0.5">{p}</mark>
      : p
  )
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [categories, setCategories] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const [totalCount, setTotalCount] = useState(0)

  const navigate = useNavigate()
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const debounceRef = useRef(null)
  const cancelRef = useRef(false)

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  useEffect(() => {
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setActiveIdx(-1)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const fetchSuggestions = useCallback(async (q) => {
    const trimmed = q.trim()
    if (trimmed.length < 1) {
      setSuggestions([])
      setCategories([])
      setTotalCount(0)
      setLoading(false)
      return
    }

    cancelRef.current = false
    setLoading(true)
    debugLog('fetchSuggestions', `query="${trimmed}"`)

    const filter = `name.ilike.%${trimmed}%,brand.ilike.%${trimmed}%,description.ilike.%${trimmed}%,short_description.ilike.%${trimmed}%`

    const [productsRes, countRes, catRes] = await Promise.all([
      supabase
        .from('products')
        .select('id, name, price, discount_price, brand, category_id, categories(id, name, slug)')
        .eq('is_active', true)
        .or(filter)
        .order('created_at', { ascending: false })
        .limit(MAX_SUGGESTIONS),

      supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true)
        .or(filter),

      supabase
        .from('categories')
        .select('id, name, slug')
        .eq('is_active', true)
        .ilike('name', `%${trimmed}%`)
        .limit(3),
    ])

    if (cancelRef.current) return

    if (productsRes.error) {
      debugLog('fetchSuggestions [products]', { code: productsRes.error.code, message: productsRes.error.message, details: productsRes.error.details, hint: productsRes.error.hint }, true)
      setLoading(false)
      return
    }

    debugLog('fetchSuggestions [products]', `Got ${productsRes.data?.length ?? 0} suggestions, total=${countRes.count ?? '?'}`)

    const prods = productsRes.data || []

    if (prods.length === 0) {
      setSuggestions([])
      setCategories(catRes.data || [])
      setTotalCount(0)
      setLoading(false)
      return
    }

    const ids = prods.map(p => p.id)
    const { data: images, error: imgErr } = await supabase
      .from('product_images')
      .select('product_id, image_url, is_primary, display_order')
      .in('product_id', ids)
      .order('display_order', { ascending: true })

    if (cancelRef.current) return

    if (imgErr) {
      debugLog('fetchSuggestions [images]', { code: imgErr.code, message: imgErr.message }, true)
    }

    const imageMap = {}
    if (images) {
      images.forEach(img => {
        if (!imageMap[img.product_id] || img.is_primary) {
          imageMap[img.product_id] = img.image_url
        }
      })
    }

    const mapped = prods.map(p => ({
      id: p.id,
      name: p.name,
      price: parseFloat(p.price) || 0,
      discount_price: p.discount_price ? parseFloat(p.discount_price) : null,
      brand: p.brand || '',
      category: p.categories?.name || '',
      categorySlug: p.categories?.slug || '',
      image: imageMap[p.id] || null,
    }))

    debugLog('fetchSuggestions [done]', `${mapped.length} suggestions, ${Object.keys(imageMap).length} with images`)

    setSuggestions(mapped)
    setCategories(catRes.data || [])
    setTotalCount(countRes.count || 0)
    setLoading(false)
  }, [])

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    setActiveIdx(-1)
    setLoading(!!val.trim())
    clearTimeout(debounceRef.current)

    if (!val.trim()) {
      cancelRef.current = true
      setSuggestions([])
      setCategories([])
      setTotalCount(0)
      setLoading(false)
      return
    }

    debounceRef.current = setTimeout(() => fetchSuggestions(val), DEBOUNCE_MS)
  }

  const handleFocus = () => {
    setHistory(getHistory())
    setOpen(true)
    if (query.trim().length >= 1 && suggestions.length === 0) {
      fetchSuggestions(query)
    }
  }

  const handleClear = () => {
    cancelRef.current = true
    clearTimeout(debounceRef.current)
    setQuery('')
    setSuggestions([])
    setCategories([])
    setTotalCount(0)
    setLoading(false)
    setActiveIdx(-1)
    inputRef.current?.focus()
  }

  const commitSearch = (term) => {
    if (!term.trim()) return
    saveHistory(term.trim())
    setHistory(getHistory())
    setOpen(false)
    setActiveIdx(-1)
    cancelRef.current = true
    clearTimeout(debounceRef.current)
    setQuery(term.trim())
    navigate(`/products?search=${encodeURIComponent(term.trim())}`)
  }

  const goToProduct = (product) => {
    saveHistory(product.name)
    setHistory(getHistory())
    setOpen(false)
    setActiveIdx(-1)
    cancelRef.current = true
    navigate(`/products/${product.id}`)
  }

  const goToCategory = (cat) => {
    setOpen(false)
    setActiveIdx(-1)
    navigate(`/products?category=${cat.slug}`)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const allItems = suggestions
    if (activeIdx >= 0 && allItems[activeIdx]) {
      goToProduct(allItems[activeIdx])
    } else {
      commitSearch(query)
    }
  }

  const handleKeyDown = (e) => {
    if (!open) return
    const total = suggestions.length
    if (total === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => (i + 1) % total)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => (i <= 0 ? total - 1 : i - 1))
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIdx(-1)
      inputRef.current?.blur()
    }
  }

  const showDropdown = open && (
    loading ||
    suggestions.length > 0 ||
    categories.length > 0 ||
    (!query.trim() && history.length > 0) ||
    (query.trim().length >= 1 && !loading && suggestions.length === 0)
  )

  const discountPct = (price, dp) => dp ? Math.round(((price - dp) / price) * 100) : null

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="relative flex items-center">
          <MagnifyingGlassIcon className="absolute left-3.5 w-5 h-5 text-gray-400 pointer-events-none z-10" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            placeholder="Search products, brands, categories..."
            autoComplete="off"
            spellCheck={false}
            className="w-full pl-10 pr-24 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm transition"
          />
          <div className="absolute right-0 flex items-center h-full">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                tabIndex={-1}
                className="px-2 text-gray-400 hover:text-gray-600 transition"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="h-full px-4 bg-orange-500 text-white rounded-r-xl hover:bg-orange-600 active:bg-orange-700 transition font-semibold text-sm flex items-center gap-1.5"
            >
              {loading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              ) : (
                <MagnifyingGlassIcon className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </form>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden max-h-[480px] overflow-y-auto">

          {!query.trim() && history.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Searches</p>
                <button
                  type="button"
                  onClick={() => { sessionStorage.removeItem(HISTORY_KEY); setHistory([]) }}
                  className="text-[10px] text-red-400 hover:text-red-600 transition font-medium"
                >
                  Clear all
                </button>
              </div>
              {history.map(term => (
                <div key={term} className="flex items-center group">
                  <button
                    type="button"
                    onClick={() => { setQuery(term); fetchSuggestions(term); setOpen(true) }}
                    className="flex-1 flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition"
                  >
                    <ClockIcon className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{term}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeHistory(term); setHistory(getHistory()) }}
                    className="pr-4 text-gray-300 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                    tabIndex={-1}
                  >
                    <XMarkIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <div className="border-t border-gray-50 mt-1" />
            </div>
          )}

          {categories.length > 0 && query.trim() && (
            <div>
              <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Categories</p>
              <div className="flex flex-wrap gap-2 px-4 pb-3">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => goToCategory(cat)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-xs font-semibold hover:bg-orange-100 transition border border-orange-100"
                  >
                    🏷️ {highlight(cat.name, query)}
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-50" />
            </div>
          )}

          {suggestions.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Products</p>
                {totalCount > MAX_SUGGESTIONS && (
                  <p className="text-[10px] text-gray-400">{totalCount} results</p>
                )}
              </div>

              {suggestions.map((s, idx) => {
                const pct = discountPct(s.price, s.discount_price)
                return (
                  <button
                    key={s.id}
                    type="button"
                    onMouseEnter={() => setActiveIdx(idx)}
                    onClick={() => goToProduct(s)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition ${
                      activeIdx === idx ? 'bg-orange-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-11 h-11 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-100">
                      {s.image ? (
                        <img
                          src={s.image}
                          alt={s.name}
                          className="w-full h-full object-cover"
                          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                        />
                      ) : null}
                      <div style={{ display: s.image ? 'none' : 'flex' }} className="w-full h-full items-center justify-center text-xl">🛍️</div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate leading-snug">{highlight(s.name, query)}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {s.brand && <span className="text-xs text-gray-400">{s.brand}</span>}
                        {s.brand && s.category && <span className="text-gray-200 text-xs">•</span>}
                        {s.category && <span className="text-xs text-gray-400">{s.category}</span>}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-gray-900">
                        ₹{(s.discount_price || s.price).toLocaleString('en-IN')}
                      </p>
                      {s.discount_price && (
                        <div className="flex items-center gap-1 justify-end">
                          <p className="text-[10px] text-gray-400 line-through">₹{s.price.toLocaleString('en-IN')}</p>
                          <span className="text-[10px] text-green-600 font-bold">{pct}%</span>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}

              <button
                type="button"
                onClick={() => commitSearch(query)}
                className="w-full px-4 py-3 text-sm text-orange-600 font-semibold hover:bg-orange-50 transition border-t border-gray-100 text-left flex items-center gap-2"
              >
                <MagnifyingGlassIcon className="w-4 h-4" />
                <span>
                  See all {totalCount > 0 ? `${totalCount} ` : ''}results for <span className="font-bold">"{query}"</span>
                </span>
              </button>
            </div>
          )}

          {!loading && query.trim().length >= 1 && suggestions.length === 0 && categories.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-sm font-medium text-gray-700">No results for "<span className="text-orange-600">{query}</span>"</p>
              <p className="text-xs text-gray-400 mt-1">Try a different keyword or check the spelling</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}