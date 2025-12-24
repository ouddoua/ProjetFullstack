import React, { useEffect, useState } from 'react';
import { ArrowRight, Search, Star, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getRestaurants } from '../services/api';

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        const loadRestos = async () => {
            try {
                const data = await getRestaurants();
                setRestaurants(data);
            } catch (err) { console.error(err); }
        };
        loadRestos();
    }, []);

    return (
        <div>
            {/* Hero Section VIVANT & COLORÉ */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                paddingTop: '80px',
                overflow: 'hidden'
            }}>
                {/* Background Image avec Overlay dégradé vibrant */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop")', // Image de resto chaleureux
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: -2
                }} />

                {/* L'overlay "Vivant" : un dégradé violet/orange semi-transparent qui donne du peps */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.7) 0%, rgba(219, 39, 119, 0.6) 100%)',
                    zIndex: -1,
                    backdropFilter: 'blur(2px)' // Léger flou pour focus sur le texte
                }} />

                <div className="container animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', color: 'white' }}>

                        {/* Badge "Nouveau" */}
                        <div className="flex-center" style={{ marginBottom: '20px' }}>
                            <span style={{
                                background: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                padding: '8px 20px',
                                borderRadius: '50px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                border: '1px solid rgba(255,255,255,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%' }}></span>
                                Plus de 500 restaurants partenaires
                            </span>
                        </div>

                        <h1 style={{
                            fontSize: '4.5rem',
                            lineHeight: 1.1,
                            marginBottom: '30px',
                            fontWeight: 800,
                            letterSpacing: '-1px'
                        }}>
                            Vivez une expérience <br />
                            <span style={{
                                background: 'linear-gradient(to right, #fbbf24, #f87171)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                                display: 'inline-block'
                            }}>culinaire inoubliable</span>
                        </h1>

                        <p style={{ fontSize: '1.25rem', color: '#f3f4f6', marginBottom: '50px', lineHeight: 1.6, maxWidth: '700px', marginInline: 'auto' }}>
                            De la cuisine de rue authentique à la gastronomie étoilée.
                            Réservez la table parfaite pour chaque occasion, instantanément.
                        </p>

                        {/* Search Box Flottante & Vibrante */}
                        <div style={{
                            background: 'white',
                            padding: '10px',
                            borderRadius: '50px',
                            display: 'flex',
                            gap: '10px',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            maxWidth: '750px',
                            margin: '0 auto 50px auto'
                        }}>
                            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <Search size={22} color="#f97316" style={{ marginLeft: '20px' }} />
                                <input type="text" placeholder="Essayer 'Sushi', 'Italien' ou 'Paris 11'..."
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        border: 'none',
                                        fontSize: '1.05rem',
                                        fontFamily: 'inherit',
                                        outline: 'none',
                                        background: 'transparent'
                                    }}
                                />
                            </div>
                            <button className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
                                Rechercher
                            </button>
                        </div>

                        <div className="flex-center" style={{ gap: '40px', color: 'rgba(255,255,255,0.8)' }}>
                            {['Réservation instantanée', 'Annulation gratuite', 'Avis vérifiés'].map((tag, i) => (
                                <div key={i} className="flex-center" style={{ gap: '8px', fontSize: '0.95rem', fontWeight: 500 }}>
                                    <div style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%', opacity: 0.6 }}></div>
                                    {tag}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Section "Populaire" - Cards vibrantes */}
            <section style={{ padding: '100px 0', background: '#fff1f2' }}>
                <div className="container">
                    <div className="flex-between" style={{ marginBottom: '50px', alignItems: 'flex-end' }}>
                        <div>
                            <h4 style={{ color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem', marginBottom: '10px' }}>Découverte</h4>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b' }}>Les plus populaires</h2>
                        </div>
                        <Link to="/restaurants" className="btn btn-secondary" style={{ borderRadius: '50px' }}>Voir tout <ArrowRight size={18} /></Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                        {restaurants.length === 0 ? <p>Chargement des restaurants...</p> :
                            restaurants.map((restau, index) => (
                                <div key={restau._id} style={{
                                    background: 'white',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)',
                                    transition: 'transform 0.3s ease',
                                    cursor: 'pointer'
                                }} className="hover-card">
                                    <Link to={`/restaurant/${restau._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                                            <img src={`https://images.unsplash.com/photo-${index % 2 === 0 ? '1540189549336-e6e99c3679fe' : '1560624052-449f5ddf0c31'}?q=80&w=800&auto=format&fit=crop`}
                                                alt="Restau"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'white', padding: '6px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                                ⭐ 4.5
                                            </div>
                                        </div>
                                        <div style={{ padding: '24px' }}>
                                            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px', color: '#1e293b' }}>
                                                {restau.name}
                                            </h3>
                                            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '6px' }}>{restau.cuisine}</p>

                                            <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '15px', color: '#64748b', fontSize: '0.95rem', marginBottom: '20px' }}>
                                                <span className="flex-center" style={{ gap: '4px' }}><MapPin size={16} /> {restau.adress?.city || 'Paris'}</span>
                                                <span className="flex-center" style={{ gap: '4px' }}><Clock size={16} /> 15min</span>
                                            </div>
                                            <div className="flex-between">
                                                <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem' }}>€€€</span>
                                                <span className="btn" style={{ background: '#fff1f2', color: 'var(--color-primary)', padding: '8px 16px', fontSize: '0.9rem' }}>Réserver</span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
