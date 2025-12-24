import React, { useState, useEffect } from 'react';
import { Search, MapPin, Utensils, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getRestaurants } from '../services/api';

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState('Tous');

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const data = await getRestaurants();
                setRestaurants(data);
                setFilteredRestaurants(data);
            } catch (err) {
                console.error("Erreur loading restaus", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, []);

    useEffect(() => {
        let result = restaurants;

        if (search) {
            result = result.filter(r =>
                r.name?.toLowerCase().includes(search.toLowerCase()) ||
                r.nom?.toLowerCase().includes(search.toLowerCase()) ||
                r.cuisine?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (selectedCuisine !== 'Tous') {
            result = result.filter(r => r.cuisine === selectedCuisine);
        }

        setFilteredRestaurants(result);
    }, [search, selectedCuisine, restaurants]);

    const cuisines = ['Tous', ...new Set(restaurants.map(r => r.cuisine).filter(Boolean))];

    if (loading) return <div className="flex-center" style={{ height: '80vh' }}>Chargement...</div>;

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Tous nos Restaurants</h1>
                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Trouvez la table parfaite parmi notre sélection exclusive.</p>
            </div>

            {/* Filters */}
            <div className="glass" style={{ padding: '20px', marginBottom: '40px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                    <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Rechercher un nom, une spécialité..."
                        className="input-field"
                        style={{ paddingLeft: '45px' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
                    {cuisines.map(c => (
                        <button
                            key={c}
                            onClick={() => setSelectedCuisine(c)}
                            className="btn"
                            style={{
                                padding: '8px 16px',
                                fontSize: '0.9rem',
                                background: selectedCuisine === c ? 'var(--color-primary)' : 'white',
                                color: selectedCuisine === c ? 'white' : 'var(--text-color)',
                                border: selectedCuisine === c ? 'none' : '1px solid #e2e8f0',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            {filteredRestaurants.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', color: '#94a3b8' }}>
                    <AlertCircle size={40} style={{ marginBottom: '15px', opacity: 0.5 }} />
                    <p>Aucun restaurant ne correspond à votre recherche.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                    {filteredRestaurants.map((restau, index) => (
                        <Link key={restau._id} to={`/restaurant/${restau._id}`} style={{ textDecoration: 'none' }}>
                            <div className="hover-card" style={{
                                background: 'white', borderRadius: '20px', overflow: 'hidden',
                                border: '1px solid #f1f5f9', height: '100%', display: 'flex', flexDirection: 'column'
                            }}>
                                <div style={{ height: '200px', position: 'relative' }}>
                                    <img
                                        src={restau.image || `https://images.unsplash.com/photo-${index % 2 === 0 ? '1517248135467-4c7edcad34c4' : '1559339352-11d035aa65de'}?q=80&w=800&auto=format&fit=crop`}
                                        alt={restau.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                        ⭐ 4.5
                                    </div>
                                </div>
                                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.25rem', color: '#1e293b' }}>{restau.name || restau.nom}</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Utensils size={16} /> {restau.cuisine}
                                    </p>
                                    <p style={{ color: '#64748b', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <MapPin size={16} /> {restau.adresse || 'Paris'}
                                    </p>

                                    <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                                        <span className="btn btn-primary" style={{ width: '100%', borderRadius: '12px' }}>
                                            Voir les disponibilités
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Restaurants;
