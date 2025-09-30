import React, { useState, useMemo } from 'react';
import { FuelLog } from '../types';
import { FuelIcon, RoadIcon } from './icons';

interface FuelFormProps {
  addFuelLog: (log: Omit<FuelLog, 'id' | 'kmPerLiter' | 'pricePerLiter' | 'distance'>) => Promise<void>;
  lastOdometer: number;
}

const FuelForm: React.FC<FuelFormProps> = ({ addFuelLog, lastOdometer }) => {
  const [odometer, setOdometer] = useState('');
  const [liters, setLiters] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pricePerLiter = useMemo(() => {
    const litersNum = parseFloat(liters);
    const priceNum = parseFloat(totalPrice);
    if (litersNum > 0 && priceNum > 0) {
      return (priceNum / litersNum).toFixed(2);
    }
    return '0.00';
  }, [liters, totalPrice]);
  
  const distanceTraveled = useMemo(() => {
    const odometerNum = parseFloat(odometer);
    if (odometerNum > lastOdometer && lastOdometer > 0) {
      return (odometerNum - lastOdometer).toFixed(1);
    }
    return null;
  }, [odometer, lastOdometer]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const odometerNum = parseFloat(odometer);
    if (lastOdometer > 0 && odometerNum <= lastOdometer) {
      setError(`O odômetro deve ser maior que o último registro (${lastOdometer} km).`);
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
        await addFuelLog({
            date,
            odometer: odometerNum,
            liters: parseFloat(liters),
            totalPrice: parseFloat(totalPrice),
        });
        setOdometer('');
        setLiters('');
        setTotalPrice('');
    } catch (err) {
        console.error(err);
        setError('Falha ao salvar. Verifique sua conexão ou as regras de segurança do Firestore.');
    } finally {
        setIsSubmitting(false);
    }
  };

  const hasDistance = distanceTraveled !== null;

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
      <h2 className="text-xl font-bold mb-4 flex items-center"><FuelIcon /> <span className="ml-2">Adicionar Abastecimento</span></h2>
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
          <label className="block text-sm font-medium text-slate-300">Odômetro (km)</label>
          <input
            type="number"
            placeholder={lastOdometer > 0 ? `Último: ${lastOdometer} km` : 'Ex: 15000'}
            value={odometer}
            onChange={(e) => setOdometer(e.target.value)}
            required
            step="0.1"
            min={lastOdometer > 0 ? lastOdometer + 0.1 : 0}
            className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300">
            Distância Percorrida
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <RoadIcon />
            </div>
            <input
              type="text"
              readOnly
              value={hasDistance ? `${distanceTraveled} km` : '—'}
              className={`w-full bg-slate-700 border border-slate-600 rounded-md p-2 pl-12 focus:ring-0 focus:outline-none cursor-default ${hasDistance ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
              aria-label="Distância percorrida desde o último abastecimento"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300">Litros (L)</label>
          <input
            type="number"
            placeholder="Ex: 40.5"
            value={liters}
            onChange={(e) => setLiters(e.target.value)}
            required
            step="0.01"
            min="0.01"
            className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300">Custo Total (R$)</label>
          <input
            type="number"
            placeholder="Ex: 220.00"
            value={totalPrice}
            onChange={(e) => setTotalPrice(e.target.value)}
            required
            step="0.01"
            min="0.01"
            className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        <div className="bg-slate-700/50 p-3 rounded-md text-center">
            <p className="text-sm text-slate-400">Preço por Litro</p>
            <p className="text-xl font-bold text-cyan-400">R$ {pricePerLiter}</p>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" disabled={isSubmitting} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed">
          {isSubmitting ? 'Salvando...' : 'Salvar Abastecimento'}
        </button>
      </form>
    </div>
  );
};

export default FuelForm;
