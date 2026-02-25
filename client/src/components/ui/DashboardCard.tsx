import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { DashboardCardProps } from '../../types';

const DashboardCard: React.FC<DashboardCardProps> = ({ icon: Icon, title, value, subtitle, color, trend }) => {
  return (
    <div className="group relative bg-white rounded-[2rem] p-7 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-gray-300/50 transition-all duration-300 border border-gray-100/50 overflow-hidden">
      {/* Decorative background element */}
      <div 
        className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500"
        style={{ backgroundColor: color }}
      />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.15em]">
              {title}
            </p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-4xl font-black text-gray-900 tracking-tight">
                {value}
              </h3>
            </div>
          </div>
          
          <div className="space-y-2">
            {subtitle && (
              <p className="text-sm font-semibold text-gray-500 leading-tight">
                {subtitle}
              </p>
            )}
            
            {trend && (
              <div className="flex items-center gap-1.5 py-1 px-3 bg-gray-50 rounded-full w-fit">
                <div 
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                  {trend}
                </span>
              </div>
            )}
          </div>
        </div>

        <div 
          className="flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg ring-4 ring-white transition-all duration-300 group-hover:-translate-y-1 group-hover:rotate-3"
          style={{ 
            backgroundColor: color,
            boxShadow: `0 10px 20px -5px ${color}40`
          }}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
