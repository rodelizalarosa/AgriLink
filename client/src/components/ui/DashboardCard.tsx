import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { DashboardCardProps } from '../../types';

const DashboardCard: React.FC<DashboardCardProps> = ({ icon: Icon, title, value, subtitle, color, trend }) => {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border-l-4`} style={{ borderColor: color }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 font-semibold text-sm mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600 font-semibold">{trend}</span>
            </div>
          )}
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: `${color}10` }}>
          <Icon className="w-8 h-8" style={{ color }} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
