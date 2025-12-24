import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getActivePlanForClient, createReservation } from '../services/api';

const ClientBooking = () => {
    const { id } = useParams();
    const [planData, setPlanData] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    // Formulaire
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState("19:00");
    const [guests, setGuests] = useState(2);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getActivePlanForClient(id);
            setPlanData(data);
        } catch (err) {
            console.error(err);
            // FALLBACK AVEC EXEMPLE
            setPlanData({
                planImage: "https://via.placeholder.com/800x600?text=Plan+Salle+Demo",
                positions: [
                    { tableId: "t1", tableNumber: 1, capacity: 2, x: 100, y: 100, rotation: 0, status: "available" },
                    { tableId: "t2", tableNumber: 2, capacity: 4, x: 250, y: 200, rotation: 15, status: "available" },
                    { tableId: "t3", tableNumber: 3, capacity: 6, x: 400, y: 120, rotation: 0, status: "available" }
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    const handleTableClick = (table) => {
        if (table.status === "available") {
            setSelectedTable(table);
            setBookingSuccess(false);
        } else {
            alert("Cette table est déjà réservée.");
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!selectedTable) return alert("Veuillez sélectionner une table sur le plan.");

        try {
            await createReservation({
                restaurantId: id,
                tableId: selectedTable.tableId,
                dateTime: `${date}T${time}:00`,
                durationMinutes: 90,
                numberOfGuests: guests
            });
            setBookingSuccess(true);
            setSelectedTable(null);
            // Optionnel : mettre à jour le statut de la table
            setPlanData(prev => ({
                ...prev,
                positions: prev.positions.map(t =>
                    t.tableId === selectedTable.tableId ? { ...t, status: "reserved" } : t
                )
            }));
        } catch (err) {
            alert("Erreur lors de la réservation : " + (err.response?.data?.msg || err.message));
        }
    };

    if (loading) return <div>Chargement du restaurant...</div>;

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
            <h2 className="section-title">Réserver une table</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>

                {/* PLAN INTERACTIF 3D */}
                <div className="glass" style={{ padding: '0', minHeight: '600px', position: 'relative', overflow: 'hidden', perspective: '1200px', background: 'radial-gradient(circle at center, #f8fafc, #e2e8f0)' }}>
                    <div style={{ padding: '20px', position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
                        <h3 style={{ marginBottom: '5px' }}>Plan de Salle 3D</h3>
                        <p style={{ fontSize: '0.9em', opacity: 0.7 }}>Cliquez sur une table pour réserver</p>
                    </div>

                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transformStyle: 'preserve-3d'
                    }}>
                        {/* PLANCHER / IMAGE DE LA SALLE */}
                        <div style={{
                            width: '600px',
                            height: '500px',
                            background: '#f8f9fa',
                            backgroundImage: `url(${planData.planImage})`,
                            backgroundSize: 'cover',
                            border: '4px solid #334155',
                            borderRadius: '2px',
                            position: 'relative',
                            transform: 'rotateX(50deg) rotateZ(-10deg)',
                            transformStyle: 'preserve-3d',
                            boxShadow: '0 50px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.1)',
                            transition: 'transform 0.1s ease-out'
                        }}
                            id="scene-floor"
                            onMouseMove={(e) => {
                                const x = (window.innerWidth / 2 - e.pageX) / 40;
                                const y = (window.innerHeight / 2 - e.pageY) / 40;
                                e.currentTarget.style.transform = `rotateX(${50 + y}deg) rotateZ(${-10 + x}deg)`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'rotateX(50deg) rotateZ(-10deg)';
                            }}
                        >
                            {/* LES TABLES */}
                            {planData.positions.map(pos => (
                                <div
                                    key={pos.tableId}
                                    onClick={() => handleTableClick(pos)}
                                    style={{
                                        position: 'absolute',
                                        left: pos.x + 'px',
                                        top: pos.y + 'px',
                                        width: '80px',
                                        height: '80px',
                                        transformStyle: 'preserve-3d',
                                        transform: `translateZ(0px) rotate(${pos.rotation}deg)`,
                                        cursor: pos.status === "available" ? 'pointer' : 'not-allowed',
                                        transition: 'transform 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = `translateZ(20px) rotate(${pos.rotation}deg) scale(1.1)`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = `translateZ(0px) rotate(${pos.rotation}deg)`;
                                    }}
                                >
                                    {/* DESSUS DE TABLE */}
                                    <div style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        background: selectedTable?.tableId === pos.tableId
                                            ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                                            : pos.status === "available"
                                                ? 'linear-gradient(135deg, #ffffff, #f1f5f9)'
                                                : 'linear-gradient(135deg, #f87171, #ef4444)',
                                        borderRadius: '12px',
                                        border: '1px solid #cbd5e1',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        transform: 'translateZ(40px)',
                                        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
                                        color: selectedTable?.tableId === pos.tableId ? 'white' : '#1e293b'
                                    }}>
                                        <span style={{ fontWeight: '800', fontSize: '1.2rem' }}>{pos.tableNumber}</span>
                                        <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>👥 {pos.capacity}</span>
                                    </div>

                                    {/* CÔTÉS DU CUBE */}
                                    <div style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        background: '#94a3b8',
                                        transform: 'translateZ(20px)',
                                        borderRadius: '12px',
                                        boxShadow: '0 20px 30px rgba(0,0,0,0.15)'
                                    }}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FORMULAIRE DE RÉSERVATION */}
                <div>
                    <div className="glass" style={{ padding: '30px' }}>
                        <h3 style={{ marginBottom: '20px' }}>Votre Réservation</h3>

                        {bookingSuccess ? (
                            <div style={{ textAlign: 'center', color: 'green', padding: '20px' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>✅</div>
                                <h4>Réservation Confirmée !</h4>
                                <p>Le restaurateur a bien reçu votre demande.</p>
                                <button className="btn btn-primary" onClick={() => setBookingSuccess(false)} style={{ marginTop: '20px' }}>
                                    Nouvelle réservation
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleBooking}>
                                <div className="input-group">
                                    <label>Date</label>
                                    <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>Heure</label>
                                    <input type="time" className="input-field" value={time} onChange={e => setTime(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>Personnes</label>
                                    <input type="number" className="input-field" value={guests} onChange={e => setGuests(parseInt(e.target.value))} min="1" max="10" required />
                                </div>

                                <div style={{ margin: '20px 0', padding: '15px', background: selectedTable ? 'rgba(59, 130, 246, 0.1)' : '#f3f4f6', borderRadius: '10px', border: selectedTable ? '1px solid var(--color-primary)' : '1px solid #ddd' }}>
                                    {selectedTable ? (
                                        <>
                                            <strong>Table sélectionnée : T{selectedTable.tableNumber}</strong>
                                            <div>Capacité : {selectedTable.capacity} personnes</div>
                                        </>
                                    ) : (
                                        <div style={{ color: '#666', fontStyle: 'italic' }}>Veuillez cliquer sur une table du plan</div>
                                    )}
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={!selectedTable}>
                                    Confirmer la réservation
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientBooking;
