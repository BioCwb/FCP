
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FuelLog, TripLog, Log } from './types';
import FuelForm from './components/FuelForm';
import TripForm from './components/TripForm';
import HistoryTable from './components/HistoryTable';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, User } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
    const [tripLogs, setTripLogs] = useState<TripLog[]>([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            if (!currentUser) {
                setFuelLogs([]);
                setTripLogs([]);
            }
        });
        return () => unsubscribe();
    }, []);

    const recalculateAllMetrics = (logs: FuelLog[]): FuelLog[] => {
        const sortedLogs = [...logs].sort((a, b) => a.odometer - b.odometer);
        return sortedLogs.map((currentLog, index, arr) => {
            const processedLog: FuelLog = { ...currentLog };
    
            processedLog.pricePerLiter = currentLog.liters > 0 ? currentLog.totalPrice / currentLog.liters : 0;
    
            if (index > 0) {
                const prevLog = arr[index - 1];
                processedLog.distance = currentLog.odometer - prevLog.odometer;
            } else {
                delete processedLog.distance;
            }
    
            if (index < arr.length - 1) {
                const nextLog = arr[index + 1];
                const distanceForThisTank = nextLog.odometer - currentLog.odometer;
                if (distanceForThisTank > 0 && currentLog.liters > 0) {
                    processedLog.kmPerLiter = distanceForThisTank / currentLog.liters;
                } else {
                    delete processedLog.kmPerLiter;
                }
            } else {
                delete processedLog.kmPerLiter;
            }
    
            return processedLog;
        });
    };

    useEffect(() => {
        if (!user) return;
        
        const fuelLogsCol = collection(db, 'users', user.uid, 'fuelLogs');
        const qFuel = query(fuelLogsCol, orderBy('odometer', 'asc'));
        const unsubscribeFuel = onSnapshot(qFuel, (snapshot) => {
            const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FuelLog));
            const calculatedLogs = recalculateAllMetrics(logs);
            setFuelLogs(calculatedLogs);
        });

        const tripLogsCol = collection(db, 'users', user.uid, 'tripLogs');
        const qTrip = query(tripLogsCol, orderBy('date', 'desc'));
        const unsubscribeTrip = onSnapshot(qTrip, (snapshot) => {
            const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TripLog));
            setTripLogs(logs);
        });

        return () => {
            unsubscribeFuel();
            unsubscribeTrip();
        };
    }, [user]);


    const addFuelLog = useCallback(async (log: Omit<FuelLog, 'id' | 'kmPerLiter' | 'pricePerLiter' | 'distance'>) => {
        if (!user) return;
        try {
            await addDoc(collection(db, 'users', user.uid, 'fuelLogs'), log);
        } catch (error) {
            console.error("Error adding fuel log: ", error);
        }
    }, [user]);

    const lastOdometer = useMemo(() => {
        if (fuelLogs.length === 0) return 0;
        return Math.max(...fuelLogs.map(log => log.odometer));
    }, [fuelLogs]);

    const addTripLog = useCallback(async (log: Omit<TripLog, 'id'>) => {
        if (!user) return;
        const newLog = { 
            ...log, 
            odometer: lastOdometer 
        };
        try {
            await addDoc(collection(db, 'users', user.uid, 'tripLogs'), newLog);
        } catch (error) {
            console.error("Error adding trip log: ", error);
        }
    }, [user, lastOdometer]);

    const deleteLog = useCallback(async (id: string, type: 'fuel' | 'trip') => {
        if (!user) return;
        const collectionName = type === 'fuel' ? 'fuelLogs' : 'tripLogs';
        try {
            await deleteDoc(doc(db, 'users', user.uid, collectionName, id));
        } catch (error) {
            console.error("Error deleting log: ", error);
        }
    }, [user]);
    
    const lastTripOdometer = useMemo(() => {
        if (tripLogs.length === 0) return 0;
        const odometers = tripLogs.map(log => log.odometer || 0).filter(Boolean);
        if (odometers.length === 0) return 0;
        return Math.max(...odometers);
    }, [tripLogs]);

    const distanceSinceLastTrip = useMemo(() => {
        if (lastOdometer > 0 && lastTripOdometer > 0 && lastOdometer > lastTripOdometer) {
            return lastOdometer - lastTripOdometer;
        }
        // If there are fuel logs but no trip logs, consider all distance since first fuel up.
        if (lastOdometer > 0 && lastTripOdometer === 0 && fuelLogs.length > 0) {
            const firstOdometer = Math.min(...fuelLogs.map(l => l.odometer));
            return lastOdometer - firstOdometer;
        }
        return 0;
    }, [lastOdometer, lastTripOdometer, fuelLogs]);

    const combinedLogs: Log[] = useMemo(() => {
        const fLogs: Log[] = fuelLogs.map(l => ({ ...l, type: 'fuel' }));
        const tLogs: Log[] = tripLogs.map(l => ({ ...l, type: 'trip' }));
        return [...fLogs, ...tLogs];
    }, [fuelLogs, tripLogs]);

    const handleLogout = () => {
        auth.signOut();
    };
    
    if (loading) {
        return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <header className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-500">
                        Fuel Control Pro
                    </h1>
                    <p className="text-slate-400 mt-2">Seu assistente para controle de combustível e ganhos.</p>
                </div>
                 {user && (
                    <div className="flex items-center mt-4 sm:mt-0">
                        <img src={user.photoURL || undefined} alt={user.displayName || 'User'} className="w-10 h-10 rounded-full mr-4" />
                        <div>
                            <p className="font-semibold">{user.displayName}</p>
                            <button onClick={handleLogout} className="text-sm text-cyan-400 hover:underline">Logout</button>
                        </div>
                    </div>
                )}
            </header>
            
            <main>
                {!user ? (
                    <Auth />
                ) : (
                    <>
                        <Dashboard fuelLogs={fuelLogs} tripLogs={tripLogs} />
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                            <FuelForm addFuelLog={addFuelLog} lastOdometer={lastOdometer} />
                            <TripForm addTripLog={addTripLog} distanceSinceLastTrip={distanceSinceLastTrip} />
                        </div>
                        
                        <div className="mt-8">
                            <HistoryTable logs={combinedLogs} deleteLog={deleteLog}/>
                        </div>
                    </>
                )}
            </main>

             <footer className="text-center text-slate-500 text-sm mt-8">
                <p>Desenvolvido para máxima eficiência.</p>
            </footer>
        </div>
    );
};

export default App;
