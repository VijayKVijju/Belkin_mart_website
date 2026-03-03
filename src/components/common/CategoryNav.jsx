import { Link } from 'react-router-dom'

export default function CategoryNav() {
  const categories = [
    { name: 'Mobiles', slug: 'mobiles', icon: '📱' },
    { name: 'Fashion', slug: 'fashion', icon: '👗' },
    { name: 'Electronics', slug: 'electronics', icon: '💻' },
    { name: 'Home & Kitchen', slug: 'home-kitchen', icon: '🏠' },
    { name: 'Beauty', slug: 'beauty', icon: '💄' },
    { name: 'Appliances', slug: 'appliances', icon: '🔌' },
    { name: 'Books', slug: 'books', icon: '📚' },
    { name: 'Toys & Games', slug: 'toys', icon: '🎮' },
    { name: 'Grocery', slug: 'grocery', icon: '🛒' },
  ]

  return (
    <nav className="bg-white border-t border-gray-200 overflow-x-auto">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-6 py-3 text-sm">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/products?category=${category.slug}`}
              className="flex items-center gap-2 whitespace-nowrap hover:text-orange-600 transition font-medium"
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
