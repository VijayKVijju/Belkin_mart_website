import React from 'react';

export default function VendorProfile() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-4xl">
      <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">Store Settings</h3>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
          <input type="text" defaultValue="BelkinMart Official Store" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
          <input type="email" defaultValue="seller@belkinmart.com" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Store Description</label>
          <textarea rows="3" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Describe your business..."></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PAN / GST Number</label>
          <input type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
        </div>
        <div className="md:col-span-2">
          <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600 transition">
            Save Store Profile
          </button>
        </div>
      </form>
    </div>
  );
}
