import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getClientReservations } from '../services/api';

const ClientProfile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const data = await getClientReservations();
                console.log("RESERVATIONS CLIENT RECUES :", data);
                setReservations(data);
            } catch (err) {
                console.error("Erreur chargement réservations", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchReservations();
        }
    }, [user]);

    if (!user) return <div className="container" style={{ paddingTop: '100px' }}>Veuillez vous connecter.</div>;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
            <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: '40px' }}>
                <div>
                    <h2 className="section-title" style={{ marginBottom: '10px' }}>Mon Profil</h2>
                    <p style={{ color: '#64748b' }}>Bienvenue, <strong>{user.nom || user.name}</strong></p>
                    <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                        <span style={{ display: 'block', marginBottom: '5px' }}>📧 {user.email}</span>
                        <span style={{ display: 'block' }}>📞 {user.telephone || user.phone || 'Non renseigné'}</span>
                    </div>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                    Se déconnecter
                </button>
            </div>

            <div className="glass" style={{ padding: '30px' }}>
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    📅 Mes Réservations
                </h3>

                {loading ? (
                    <p>Chargement...</p>
                ) : reservations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                        <p>Aucune réservation pour le moment.</p>
                        <a href="/" className="btn btn-primary" style={{ marginTop: '15px', display: 'inline-block' }}>Réserver une table</a>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '20px' }}>
                        {reservations.map(res => (
                            <div key={res._id} style={{
                                background: 'white',
                                padding: '20px',
                                borderRadius: '12px',
                                borderLeft: `5px solid ${res.status === 'confirme' ? '#22c55e' : res.status === 'attente' ? '#f59e0b' : '#ef4444'}`,
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                            }}>
                                <div className="flex-between">
                                    <div>
                                        <h4 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>
                                            {res.restau?.nom || 'Restaurant inconnu'}
                                        </h4>
                                        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                                            {new Date(res.dateTime).toLocaleDateString()} à {new Date(res.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>
                                            👤 {res.numberOfGuests} personnes
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            background: res.status === 'confirme' ? '#dcfce7' : res.status === 'attente' ? '#fef3c7' : '#fee2e2',
                                            color: res.status === 'confirme' ? '#166534' : res.status === 'attente' ? '#92400e' : '#991b1b'
                                        }}>
                                            {res.status === 'confirme' ? 'Confirmé' : res.status === 'attente' ? 'En attente' : 'Annulé'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientProfile;
