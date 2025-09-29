
import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, unit, icon }) => {
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg flex items-center space-x-4">
      <div className="bg-slate-700 p-3 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-sm">{label}</p>
        <p className="text-2xl font-bold text-cyan-400">
          {value} <span className="text-lg text-slate-300">{unit}</span>
        </p>
      </div>
    </div>
  );
};

export default StatCard;
