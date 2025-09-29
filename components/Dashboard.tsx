import React, { useMemo } from 'react';
import { FuelLog, TripLog } from '../types';
import StatCard from './StatCard';
import { FuelIcon, MoneyIcon, GaugeIcon, RoadIcon, PriceTagIcon } from './icons';

interface DashboardProps {
  fuelLogs: FuelLog[];
  tripLogs: TripLog[];
}

const Dashboard: React.FC<DashboardProps> = ({ fuelLogs, tripLogs }) => {
  const stats = useMemo(() => {
    const totalSpent = fuelLogs.reduce((acc, log) => acc + log.totalPrice, 0);
    const totalLiters = fuelLogs.reduce((acc, log) => acc + log.liters, 0);
    const avgPricePerLiter = totalLiters > 0 ? totalSpent / totalLiters : 0;

    const totalEarnings = tripLogs.reduce((acc, log) => acc + log.earnings, 0);
    const netProfit = totalEarnings - totalSpent;
    
    const validKmLs = fuelLogs.map(log => log.kmPerLiter).filter((kml): kml is number => kml !== undefined && kml > 0 && isFinite(kml));
    const avgKmL = validKmLs.length > 0 ? validKmLs.reduce((acc, kml) => acc + kml, 0) / validKmLs.length : 0;

    const firstOdometer = fuelLogs.length > 0 ? fuelLogs[0].odometer : 0;
    const lastOdometer = fuelLogs.length > 0 ? fuelLogs[fuelLogs.length - 1].odometer : 0;
    const totalDistance = lastOdometer - firstOdometer;
    
    const costPerKm = totalDistance > 0 ? totalSpent / totalDistance : 0;

    return { totalSpent, totalEarnings, netProfit, avgKmL, costPerKm, avgPricePerLiter };
  }, [fuelLogs, tripLogs]);
  
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard 
            label="Consumo Médio" 
            value={stats.avgKmL.toFixed(2)} 
            unit="km/L"
            icon={<GaugeIcon />} 
        />
        <StatCard 
            label="Custo por KM" 
            value={stats.costPerKm.toFixed(2)} 
            unit="R$/km"
            icon={<RoadIcon />}
        />
        <StatCard 
            label="Preço Médio Litro"
            value={stats.avgPricePerLiter.toFixed(2)}
            unit="R$/L"
            icon={<PriceTagIcon />}
        />
        <StatCard 
            label="Total Gasto" 
            value={stats.totalSpent.toFixed(2)}
            unit="R$"
            icon={<FuelIcon />}
        />
        <StatCard 
            label="Total Ganhos" 
            value={stats.totalEarnings.toFixed(2)}
            unit="R$"
            icon={<MoneyIcon />}
        />
        <div className={`bg-slate-800 p-4 rounded-lg shadow-lg flex items-center space-x-4 h-full ${stats.netProfit >= 0 ? 'border-green-500' : 'border-red-500'} border-2`}>
            <div className={`p-3 rounded-full ${stats.netProfit >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              <MoneyIcon />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Lucro Líquido</p>
              <p className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.netProfit.toFixed(2)} <span className="text-lg text-slate-300">R$</span>
              </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;