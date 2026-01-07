import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Utensils, CalendarDays, Armchair, Save, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import {
    getRestaurantProfile,
    updateRestaurantProfile,
    updateRestaurantPlan,
    getRestaurantReservations,
    updateReservationStatus as apiUpdateStatus
} from '../services/api';
import PlanEditor from '../components/plan/PlanEditor';

const RestaurantDashboard = () => {
    const navigate = useNavigate(); // Initialisez le hook
    const [activeTab, setActiveTab] = useState('profil');
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState(null); // Pour afficher succès/erreur

    const [profile, setProfile] = useState({
        nom: '',
        adresse: '',
        cuisine: '',
        description: '',
    });

    const [tables, setTables] = useState([]);
    const [reservations, setReservations] = useState([]);

    // Charger les données au montage
    // Charger les données au montage
    useEffect(() => {
        const token = localStorage.getItem('token'); // Vérifiez votre méthode de stockage
        if (!token) {
            navigate('/login');
        } // Redirige si plus de token
        const loadData = async () => {
            try {
                setLoading(true);

                // 1. Charger le profil
                const restauData = await getRestaurantProfile();
                setProfile({
                    nom: restauData.nom || '',
                    adresse: restauData.adresse || '',
                    cuisine: restauData.cuisine || '',
                    description: restauData.description || ''
                });

                // 2. Charger les réservations (si le profil existe)
                try {
                    const resData = await getRestaurantReservations();
                    console.log("Réservations chargées:", resData);
                    setReservations(resData);
                } catch (resErr) {
                    console.error("Erreur chargement réservations", resErr);
                }

                // 3. Charger le plan (si besoin, ou on utilise les tables du profil si incluses)
                // const plan = await getRestaurantPlan(); ...

            } catch (err) {
                // Si l'erreur est 404, c'est que c'est un nouveau compte, on ne log pas d'erreur
                if (err.response && err.response.status === 404) {
                    console.log("Nouveau restaurateur : aucun profil à charger.");
                } else {
                    console.error("Erreur technique lors du chargement", err);
                }
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Handlers
    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleTableChange = (index, field, value) => {
        const newTables = [...tables];
        newTables[index][field] = value;
        setTables(newTables);
    };

    const addTable = () => {
        setTables([...tables, { numero: tables.length + 1, capacite: 2, isAvailable: true }]);
    };

    // Actions API
    const saveProfile = async () => {
        try {
            console.log("Envoi des données au serveur...", profile);

            const response = await updateRestaurantProfile(profile);

            // ✅ LOG DE CONFIRMATION FRONTEND
            console.log("✅ RÉPONSE SERVEUR REÇUE :", response);

            showMsg('success', 'Profil enregistré avec succès dans la base !');
        } catch (err) {
            // ❌ LOG D'ERREUR FRONTEND
            console.error("ÉCHEC DE L'ENREGISTREMENT :", err.response?.data || err.message);
            showMsg('error', 'Erreur lors de la mise à jour.');
        }
    };

    const savePlan = async () => {
        try {
            // Le backend attend { tables: [...] }
            await updateRestaurantPlan({ tables });
            showMsg('success', 'Plan de salle enregistré !');
        } catch (err) {
            showMsg('error', 'Erreur enregistrement plan.');
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await apiUpdateStatus(id, status);
            // Mettre à jour l'UI localement
            setReservations(reservations.map(res =>
                res._id === id ? { ...res, status } : res
            ));
            showMsg('success', `Réservation ${status} !`);
        } catch (err) {
            showMsg('error', 'Erreur mise à jour statut.');
        }
    };

    const showMsg = (type, text) => {
        setMsg({ type, text });
        setTimeout(() => setMsg(null), 3000);
    };

    if (loading) {
        return <div className="flex-center" style={{ height: '100vh' }}><Loader2 className="animate-spin" size={40} color="var(--color-primary)" /></div>;
    }

    return (
        <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#f8fafc', paddingBottom: '50px' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>

                {/* Header */}
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', color: '#1e293b', fontWeight: 800 }}>Tableau de Bord Restaurant</h1>
                    <p style={{ color: '#64748b' }}>Gérez votre établissement, vos tables et vos réservations.</p>
                </div>

                {/* Message Toast */}
                {msg && (
                    <div style={{
                        position: 'fixed', bottom: '20px', right: '20px',
                        padding: '15px 25px', borderRadius: '12px',
                        background: msg.type === 'success' ? '#dcfce7' : '#fee2e2',
                        color: msg.type === 'success' ? '#166534' : '#991b1b',
                        fontWeight: 600, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        zIndex: 100, display: 'flex', alignItems: 'center', gap: '10px'
                    }}>
                        {msg.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                        {msg.text}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '30px', flexDirection: 'column' }}>

                    {/* Navigation Tabs */}
                    <div style={{
                        display: 'flex', gap: '15px', background: 'white', padding: '15px',
                        borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        {/* Tabs Buttons (Profil, Tables, Reservations) */}
                        {['profil', 'tables', 'reservations'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className="btn"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '10px 20px', borderRadius: '10px',
                                    background: activeTab === tab ? 'var(--color-primary)' : 'transparent',
                                    color: activeTab === tab ? 'white' : '#64748b',
                                    fontWeight: 500, textTransform: 'capitalize'
                                }}
                            >
                                {tab === 'profil' && <Utensils size={18} />}
                                {tab === 'tables' && <Armchair size={18} />}
                                {tab === 'reservations' && <CalendarDays size={18} />}
                                {tab === 'profil' ? 'Mon Restaurant' : tab === 'tables' ? 'Plan de Salle' : 'Réservations'}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div style={{
                        background: 'white', borderRadius: '24px', padding: '40px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
                    }}>

                        {/* --- TAB: PROFIL --- */}
                        {activeTab === 'profil' && (
                            <div className="animate-fade-in">
                                <h2 style={sectionTitleStyle}><Utensils color="var(--color-primary)" /> Informations du Restaurant</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="form-group">
                                        <label>Nom du Restaurant</label>
                                        <input type="text" name="nom" value={profile.nom} onChange={handleProfileChange} style={inputStyle} />
                                    </div>
                                    <div className="form-group">
                                        <label>Type de Cuisine</label>
                                        <input type="text" name="cuisine" value={profile.cuisine} onChange={handleProfileChange} style={inputStyle} />
                                    </div>
                                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                        <label>Adresse</label>
                                        <input type="text" name="adresse" value={profile.adresse} onChange={handleProfileChange} style={inputStyle} />
                                    </div>
                                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                        <label>Description</label>
                                        <textarea name="description" value={profile.description} onChange={handleProfileChange} style={{ ...inputStyle, minHeight: '100px' }} />
                                    </div>
                                </div>
                                <button onClick={saveProfile} className="btn btn-primary" style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Save size={18} /> Enregistrer les modifications
                                </button>
                            </div>
                        )}

                        {/* --- TAB: TABLES (PLAN) --- */}
                        {activeTab === 'tables' && (
                            <div className="animate-fade-in">
                                <PlanEditor />
                            </div>
                        )}

                        {/* --- TAB: RESERVATIONS --- */}
                        {activeTab === 'reservations' && (
                            <div className="animate-fade-in">
                                <h2 style={sectionTitleStyle}><CalendarDays color="var(--color-primary)" /> Réservations Reçues</h2>

                                {reservations.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Aucune réservation pour le moment.</div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        {reservations.map((res) => (
                                            <div key={res._id || res.id} style={reservationCardStyle}>
                                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                                    <div style={dateBoxStyle}>
                                                        {new Date(res.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>
                                                            {new Date(res.dateTime).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>
                                                            {res.user ? res.user.nom : 'Client Inconnu'}
                                                        </h3>
                                                        <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                                                            {res.numberOfGuests} personnes • {res.user?.telephone}
                                                        </p>
                                                    </div>
                                                    <div style={{ paddingLeft: '20px', borderLeft: '1px solid #e2e8f0' }}>
                                                        <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Table</div>
                                                        <div style={{ fontSize: '1.2rem', color: 'var(--color-primary)', fontWeight: 800 }}>
                                                            #{res.table?.tableNumber || '?'}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                    {res.status === 'attente' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleUpdateStatus(res._id || res.id, 'confirme')}
                                                                style={{ ...actionBtnStyle, background: '#dcfce7', color: '#166534' }}
                                                            >
                                                                <CheckCircle size={20} /> Accepter
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateStatus(res._id || res.id, 'refuse')}
                                                                style={{ ...actionBtnStyle, background: '#fee2e2', color: '#991b1b' }}
                                                            >
                                                                <XCircle size={20} /> Refuser
                                                            </button>
                                                        </>
                                                    )}
                                                    {res.status === 'confirme' && (
                                                        <span style={{ color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                            <CheckCircle size={18} /> Confirmé
                                                        </span>
                                                    )}
                                                    {res.status === 'refuse' && (
                                                        <span style={{ color: '#991b1b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                            <XCircle size={18} /> Refusé
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

// Styles
const inputStyle = {
    width: '100%', padding: '12px', borderRadius: '10px',
    border: '1px solid #cbd5e1', marginTop: '5px', fontSize: '1rem', outline: 'none'
};
const actionBtnStyle = {
    border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.9rem'
};
const sectionTitleStyle = {
    fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'
};
const tableCardStyle = {
    border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', background: '#f8fafc', position: 'relative'
};
const reservationCardStyle = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px',
    background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
};
const dateBoxStyle = {
    background: '#eff6ff', color: '#3b82f6', fontWeight: 800, padding: '10px 15px', borderRadius: '10px', textAlign: 'center'
};

export default RestaurantDashboard;
//Andi mochkla el restau yetsajel el statut mteou en attente w andy mochkla fel plan les plan matsirech lenregistrement mtehhom w lezmeni nchouf fazet el tables wel plan deja namel haja makhyr w nefhem kifeh namel table sur plan 