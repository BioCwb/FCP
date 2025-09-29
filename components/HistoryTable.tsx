import React from 'react';
import { Log } from '../types';
import { FuelIcon, MoneyIcon, CalendarIcon } from './icons';

interface HistoryTableProps {
  logs: Log[];
  deleteLog: (id: string, type: 'fuel' | 'trip') => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ logs, deleteLog }) => {
  if (logs.length === 0) {
    return (
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl text-center">
        <h2 className="text-xl font-bold mb-2">Histórico de Lançamentos</h2>
        <p className="text-slate-400">Nenhum lançamento encontrado. Adicione um abastecimento ou ganho para começar.</p>
      </div>
    );
  }

  const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || ('odometer' in b ? b.odometer : 0) - ('odometer' in a ? a.odometer : 0));

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
      <h2 className="text-xl font-bold mb-4">Histórico de Lançamentos</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="p-3">Tipo</th>
              <th className="p-3">Data</th>
              <th className="p-3">Detalhes</th>
              <th className="p-3 text-right">Valor</th>
              <th className="p-3 text-right">Ação</th>
            </tr>
          </thead>
          <tbody>
            {sortedLogs.map((log) => (
              <tr key={log.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                <td className="p-3">
                  {log.type === 'fuel' ? (
                    <span className="flex items-center text-cyan-400"><FuelIcon /> <span className="ml-2 hidden md:inline">Abastecimento</span></span>
                  ) : (
                    <span className="flex items-center text-emerald-400"><MoneyIcon /> <span className="ml-2 hidden md:inline">Ganho</span></span>
                  )}
                </td>
                <td className="p-3 text-slate-300 whitespace-nowrap">
                    <div className="flex items-center">
                        <CalendarIcon />
                        {/* FIX: Corrected typo from toLocaleDateDateString to toLocaleDateString */}
                        {new Date(log.date + 'T00:00:00').toLocaleDateString()}
                    </div>
                </td>
                <td className="p-3 text-slate-400 text-sm whitespace-nowrap">
                  {log.type === 'fuel' ? (
                    <span>
                      {log.odometer}km
                      {log.distance ? <span className="text-slate-500"> (+{log.distance.toFixed(1)}km)</span> : ''}
                      {' | '}{log.liters.toFixed(2)}L
                      {log.pricePerLiter ? ` | R$${log.pricePerLiter.toFixed(2)}/L` : ''}
                      {log.kmPerLiter ? ` | ${log.kmPerLiter.toFixed(2)}km/L` : ''}
                    </span>
                  ) : (
                    <span>
                      {log.distance.toFixed(1)} km
                      {log.odometer ? <span className="text-slate-500"> (até {log.odometer}km)</span> : ''}
                    </span>
                  )}
                </td>
                <td className="p-3 text-right font-mono">
                  {log.type === 'fuel' ? (
                    <span className="text-red-400">- R$ {log.totalPrice.toFixed(2)}</span>
                  ) : (
                    <span className="text-green-400">+ R$ {log.earnings.toFixed(2)}</span>
                  )}
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => deleteLog(log.id, log.type)} className="text-slate-400 hover:text-red-500 transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;