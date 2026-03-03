import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Company Overview [cite: 2] */}
          <div>
            <h3 className="text-xl font-bold mb-4">BelkinMart</h3>
            <p className="text-gray-400 text-sm">
              Your trusted multi-vendor marketplace [cite: 5] for quality apparel, 
              electronics, and organic essentials.
            </p>
          </div>

          {/* Column 2: About Us Links [cite: 1] */}
          <div>
            <h4 className="font-semibold mb-4 text-orange-500">About Us</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/about#overview" className="hover:text-white">Company Overview</Link></li>
              <li><Link to="/about#vision" className="hover:text-white">Vision & Mission</Link></li>
              <li><Link to="/about#why-us" className="hover:text-white">Why Choose Belkinmart</Link></li>
              <li><Link to="/about#partnership" className="hover:text-white">Vendor Partnership Program</Link></li>
            </ul>
          </div>

          {/* Column 3: Policy & Navigation [cite: 7] */}
          <div>
            <h4 className="font-semibold mb-4 text-orange-500">Customer Care</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/products" className="hover:text-white">Shop Now</Link></li>
              <li><Link to="/about#payment-policy" className="hover:text-white">Secure Payment Policy</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link to="/vendor/dashboard" className="hover:text-white">Become a Vendor</Link></li>
            </ul>
          </div>

          {/* Column 4: Document Categories [cite: 8] */}
          <div>
            <h4 className="font-semibold mb-4 text-orange-500">Top Categories</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/products?category=apparel" className="hover:text-white">Apparel & Footwear</Link></li>
              <li><Link to="/products?category=electronics" className="hover:text-white">Electronics & Appliances</Link></li>
              <li><Link to="/products?category=food" className="hover:text-white">Food & Supplements</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          <p>© {currentYear} BelkinMart Multi-Vendor Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
