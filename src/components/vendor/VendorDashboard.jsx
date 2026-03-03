import React from 'react';
import { 
  CurrencyRupeeIcon, 
  ShoppingBagIcon, 
  UserGroupIcon, 
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/outline';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" /> 
      </div>
    </div>
  </div>
);

export default function VendorDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Sales" value="₹45,231" icon={CurrencyRupeeIcon} color="bg-green-500" />
        <StatCard title="Total Orders" value="128" icon={ShoppingBagIcon} color="bg-blue-500" />
        <StatCard title="Active Products" value="42" icon={ArrowTrendingUpIcon} color="bg-orange-500" />
        <StatCard title="Customer Base" value="89" icon={UserGroupIcon} color="bg-purple-500" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4">Recent Sales Activity</h3>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg text-gray-400">
          Sales Chart Visualization Area (Integration Pending)
        </div>
      </div>
    </div>
  );
}
