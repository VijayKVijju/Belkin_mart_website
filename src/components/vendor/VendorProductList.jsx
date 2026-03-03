import React from 'react';
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function VendorProductList() {
  const products = [
    { id: 1, name: "Formal Men's Suit", category: "Apparel", price: "₹4,999", stock: 15 },
    { id: 2, name: "Smart Watch Series 7", category: "Electronics", price: "₹12,500", stock: 8 },
    { id: 3, name: "Organic Honey 500g", category: "Food", price: "₹450", stock: 50 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <h3 className="font-bold text-gray-700">My Products</h3>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-orange-600">
          <PlusIcon className="w-4 h-4" /> Add New Product
        </button>
      </div>
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
          <tr>
            <th className="p-4 font-semibold">Product</th>
            <th className="p-4 font-semibold">Category</th>
            <th className="p-4 font-semibold">Price</th>
            <th className="p-4 font-semibold">Stock</th>
            <th className="p-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition">
              <td className="p-4 font-medium text-gray-900">{item.name}</td>
              <td className="p-4 text-sm text-gray-600">{item.category}</td>
              <td className="p-4 text-sm font-bold">{item.price}</td>
              <td className="p-4 text-sm text-gray-600">{item.stock} units</td>
              <td className="p-4 text-right">
                <div className="flex justify-end gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><PencilSquareIcon className="w-5 h-5" /></button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><TrashIcon className="w-5 h-5" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
