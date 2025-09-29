import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FuelLog, TripLog, Log } from './types';
import FuelForm from './components/FuelForm';
import TripForm from './components/TripForm';
import HistoryTable from './components/HistoryTable';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
    const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(() => {
        const saved = localStorage.getItem('fuelLogs');
        return saved ? JSON.parse(saved) : [];
    });

    const [tripLogs, setTripLogs] = useState<TripLog[]>(() => {
        const saved = localStorage.getItem('tripLogs');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('fuelLogs', JSON.stringify(fuelLogs));
    }, [fuelLogs]);

    useEffect(() => {
        localStorage.setItem('tripLogs', JSON.stringify(tripLogs));
    }, [tripLogs]);

    const recalculateAllMetrics = (logs: FuelLog[]): FuelLog[] => {
        const sortedLogs = [...logs].sort((a, b) => a.odometer - b.odometer);
        return sortedLogs.map((currentLog, index, arr) => {
            const processedLog: FuelLog = { ...currentLog };
    
            // Calculate distance for the current log (from the previous one)
            if (index > 0) {
                const prevLog = arr[index - 1];
                processedLog.distance = currentLog.odometer - prevLog.odometer;
            } else {
                delete processedLog.distance;
            }
    
            // Calculate km/L for the current log (based on the next one)
            if (index < arr.length - 1) {
                const nextLog = arr[index + 1];
                const distanceForThisTank = nextLog.odometer - currentLog.odometer;
                if (distanceForThisTank > 0 && currentLog.liters > 0) {
                    processedLog.kmPerLiter = distanceForThisTank / currentLog.liters;
                } else {
                    delete processedLog.kmPerLiter;
                }
            } else {
                delete processedLog.kmPerLiter; // Last log cannot have km/L calculated
            }
    
            return processedLog;
        });
    };


    const addFuelLog = useCallback((log: Omit<FuelLog, 'id' | 'kmPerLiter' | 'pricePerLiter' | 'distance'>) => {
        setFuelLogs(prevLogs => {
            const pricePerLiter = log.liters > 0 ? log.totalPrice / log.liters : 0;
            const newLog = { ...log, id: new Date().toISOString() + Math.random(), pricePerLiter };
            
            const updatedLogs = [...prevLogs, newLog];
            return recalculateAllMetrics(updatedLogs);
        });
    }, []);

    const lastOdometer = useMemo(() => {
        if (fuelLogs.length === 0) return 0;
        return Math.max(...fuelLogs.map(log => log.odometer));
    }, [fuelLogs]);

    const addTripLog = useCallback((log: Omit<TripLog, 'id'>) => {
        const newLog = { 
            ...log, 
            id: new Date().toISOString() + Math.random(),
            odometer: lastOdometer 
        };
        setTripLogs(prevLogs => [...prevLogs, newLog]);
    }, [lastOdometer]);

    const deleteLog = useCallback((id: string, type: 'fuel' | 'trip') => {
        if (type === 'fuel') {
             setFuelLogs(prevLogs => {
                const filteredLogs = prevLogs.filter(log => log.id !== id);
                return recalculateAllMetrics(filteredLogs);
             });
        } else {
            setTripLogs(prevLogs => prevLogs.filter(log => log.id !== id));
        }
    }, []);
    
    const lastTripOdometer = useMemo(() => {
        if (tripLogs.length === 0) return 0;
        const odometers = tripLogs.map(log => log.odometer || 0);
        return Math.max(...odometers);
    }, [tripLogs]);

    const distanceSinceLastTrip = useMemo(() => {
        if (lastOdometer > lastTripOdometer) {
            return lastOdometer - lastTripOdometer;
        }
        return 0;
    }, [lastOdometer, lastTripOdometer]);

    const combinedLogs: Log[] = useMemo(() => {
        const fLogs: Log[] = fuelLogs.map(l => ({ ...l, type: 'fuel' }));
        const tLogs: Log[] = tripLogs.map(l => ({ ...l, type: 'trip' }));
        return [...fLogs, ...tLogs];
    }, [fuelLogs, tripLogs]);

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <header className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-500">
                    Fuel Control Pro
                </h1>
                <p className="text-slate-400 mt-2">Seu assistente para controle de combustível e ganhos.</p>
            </header>
            
            <main>
                <Dashboard fuelLogs={fuelLogs} tripLogs={tripLogs} />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    <FuelForm addFuelLog={addFuelLog} lastOdometer={lastOdometer} />
                    <TripForm addTripLog={addTripLog} distanceSinceLastTrip={distanceSinceLastTrip} />
                </div>
                
                <div className="mt-8">
                    <HistoryTable logs={combinedLogs} deleteLog={deleteLog}/>
                </div>
            </main>

             <footer className="text-center text-slate-500 text-sm mt-8">
                <p>Desenvolvido para máxima eficiência.</p>
            </footer>
        </div>
    );
};

export default App;