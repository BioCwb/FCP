import React, { useState, useEffect } from 'react';
import { TripLog } from '../types';
import { MoneyIcon } from './icons';

interface TripFormProps {
  addTripLog: (log: Omit<TripLog, 'id'>) => void;
  distanceSinceLastTrip: number;
}

const TripForm: React.FC<TripFormProps> = ({ addTripLog, distanceSinceLastTrip }) => {
  const [distance, setDistance] = useState('');
  const [earnings, setEarnings] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (distanceSinceLastTrip > 0) {
      setDistance(distanceSinceLastTrip.toFixed(1));
    } else {
      setDistance('');
    }
  }, [distanceSinceLastTrip]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTripLog({
      date,
      distance: parseFloat(distance),
      earnings: parseFloat(earnings),
    });
    setDistance('');
    setEarnings('');
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
      <h2 className="text-xl font-bold mb-4 flex items-center"><MoneyIcon /> <span className="ml-2">Adicionar Ganhos</span></h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300">Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300">Distância (km)</label>
          <input
            type="number"
            placeholder="Ex: 150"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            required
            step="0.1"
            className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300">Ganhos (R$)</label>
          <input
            type="number"
            placeholder="Ex: 350.00"
            value={earnings}
            onChange={(e) => setEarnings(e.target.value)}
            required
            step="0.01"
            className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
          Salvar Ganhos
        </button>
      </form>
    </div>
  );
};

export default TripForm;