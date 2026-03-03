import { Link } from 'react-router-dom'
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    quickLinks: [
      { name: 'About Us', path: '/about' },
      { name: 'Shop', path: '/products' },
      { name: 'Contact', path: '/contact' },
      { name: 'Become a Vendor', path: '/vendor/dashboard' },
    ],
    customerService: [
      { name: 'Shipping Policy', path: '/shipping' },
      { name: 'Returns & Refunds', path: '/returns' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms & Conditions', path: '/terms' },
    ],
  }

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold text-xl px-3 py-2 rounded-lg">
                BM
              </div>
              <h3 className="text-white text-lg font-semibold">BelkinMart</h3>
            </div>
            <p className="text-sm mb-4">
              Your trusted multi-vendor marketplace for everything you need.
            </p>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-white transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.customerService.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-white transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <PhoneIcon className="w-5 h-5" />
                <span>+91 1800-XXX-XXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <EnvelopeIcon className="w-5 h-5" />
                <span>support@belkinmart.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPinIcon className="w-5 h-5 flex-shrink-0" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {currentYear} BelkinMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
