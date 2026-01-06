import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getActivePlanForClient, createReservation } from '../services/api';
import PlanViewer from '../components/plan/PlanViewer';

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

    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsConnected(!!token);
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getActivePlanForClient(id);
            console.log("Plan Data received:", data); // Debug
            setPlanData(data);
        } catch (err) {
            console.error("Error loading plan:", err);
            // FALLBACK AVEC EXEMPLE
            setPlanData({
                plan: { imageUrl: "" },
                tables: [],
                positions: []
            });
        } finally {
            setLoading(false);
        }
    };

    const handleTableClick = (table) => {
        // Adapt check to support both 'status' string and 'isAvailable' boolean
        const isAvailable = table.isAvailable !== false && table.status !== "occupied" && table.status !== "reserved";

        if (isAvailable) {
            setSelectedTable(table);
            setBookingSuccess(false);
        } else {
            alert("Cette table est déjà réservée/indisponible.");
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();

        if (!isConnected) {
            alert("Vous devez être connecté pour réserver une table. Veuillez vous connecter ou créer un compte.");
            // On pourrait rediriger vers /login ici
            // window.location.href = '/login';
            return;
        }

        if (!selectedTable) return alert("Veuillez sélectionner une table sur le plan.");

        try {
            console.log("Sending reservation request...");
            await createReservation({
                restaurantId: id,
                tableId: selectedTable._id || selectedTable.tableId, // Support both ID formats
                dateTime: `${date}T${time}:00`,
                durationMinutes: 90,
                numberOfGuests: guests
            });
            console.log("Reservation Success!");
            setBookingSuccess(true);
            setSelectedTable(null);
            // Optionnel : mettre à jour le statut de la table
            setPlanData(prev => ({
                ...prev,
                tables: prev.tables.map(t =>
                    (t._id === selectedTable._id || t.tableId === selectedTable.tableId) ? { ...t, isAvailable: false, status: "reserved" } : t
                )
            }));
        } catch (err) {
            console.error("Booking Error:", err);
            alert("Erreur lors de la réservation : " + (err.response?.data?.msg || err.message));
        }
    };

    if (loading) return <div>Chargement du restaurant...</div>;

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
            <h2 className="section-title">Réserver une table</h2>
            {!isConnected && (
                <div style={{ background: '#fff3cd', color: '#856404', padding: '10px', borderRadius: '5px', marginBottom: '20px', textAlign: 'center' }}>
                    ⚠️ Vous n'êtes pas connecté. Vous pourrez voir le plan, mais vous devrez vous connecter pour finaliser la réservation.
                </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>

                {/* PLAN INTERACTIF 2D */}
                <div className="glass" style={{ padding: '0', minHeight: '600px', position: 'relative', overflow: 'hidden', background: '#f8fafc' }}>
                    <div style={{ padding: '20px', position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
                        <h3 style={{ marginBottom: '5px' }}>Plan de la Salle</h3>
                        <p style={{ fontSize: '0.9em', opacity: 0.7 }}>Cliquez sur une table pour réserver</p>
                    </div>

                    <div style={{ width: '100%', height: '100%', marginTop: '60px' }}>
                        {planData && (
                            <PlanViewer
                                plan={planData.plan}
                                tables={planData.tables}
                                onTableSelect={handleTableClick}
                                selectedTableId={selectedTable?._id || selectedTable?.tableId} // Handle both ID formats if necessary
                            />
                        )}
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
