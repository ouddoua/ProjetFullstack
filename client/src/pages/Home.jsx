import React, { useEffect, useState } from 'react';
import { ArrowRight, Search, Star, MapPin, Clock, Utensils, Award, CalendarCheck, ShieldCheck, Mail, Phone, Instagram, Facebook } from 'lucide-react';
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
        <div style={{ overflowX: 'hidden' }}>
            {/* --- HERO SECTION --- */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                paddingTop: '80px',
                overflow: 'hidden'
            }}>
                {/* Background Image Darker */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: -2,
                    filter: 'brightness(0.6)' // Assombri l'image pour le contraste
                }} className="animate-float" />

                {/* Overlay Dégradé Plus Sombre pour lisibilité */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(20, 20, 30, 0.7) 100%)',
                    zIndex: -1,
                    backdropFilter: 'blur(2px)'
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', color: 'white' }}>

                        {/* Badge Animé */}
                        <div className="flex-center animate-fade-in-up" style={{ marginBottom: '25px' }}>
                            <span className="shine-badge" style={{
                                padding: '10px 24px',
                                borderRadius: '50px',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                border: '1px solid rgba(255,255,255,0.3)',
                                display: 'flex', alignItems: 'center', gap: '10px',
                                background: 'rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(10px)',
                                color: '#ffffff'
                            }}>
                                <span style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 10px #4ade80' }}></span>
                                La plateforme #1 de réservation en France
                            </span>
                        </div>

                        <h1 className="animate-fade-in-up delay-100" style={{
                            fontSize: 'clamp(3rem, 6vw, 5rem)',
                            lineHeight: 1.1,
                            marginBottom: '30px',
                            fontWeight: 800,
                            letterSpacing: '-2px',
                            color: '#ffffff',
                            textShadow: '0 4px 10px rgba(0,0,0,0.3)'
                        }}>
                            Réservez l'excellence <br />
                            <span style={{
                                background: 'linear-gradient(to right, #fbbf24, #f97316)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                            }}>en un clic.</span>
                        </h1>

                        <p className="animate-fade-in-up delay-200" style={{
                            fontSize: '1.35rem', color: '#e2e8f0', marginBottom: '50px',
                            lineHeight: 1.6, maxWidth: '750px', marginInline: 'auto', fontWeight: 400,
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}>
                            Une sélection exclusive des meilleures tables.
                            Vérifiez la disponibilité en temps réel, réservez instantanément et profitez.
                        </p>

                        {/* Search Box Flottante */}
                        <div className="animate-fade-in-up delay-300" style={{
                            background: 'white',
                            padding: '10px',
                            borderRadius: '50px',
                            display: 'flex',
                            gap: '10px',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            maxWidth: '800px',
                            margin: '0 auto 60px auto',
                            border: '1px solid rgba(255,255,255,0.5)'
                        }}>
                            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <Search size={24} color="#f97316" style={{ marginLeft: '20px' }} />
                                <input type="text" placeholder="Rechercher 'Gastronomique', 'Lyon'..."
                                    style={{
                                        width: '100%', padding: '16px 20px', border: 'none',
                                        fontSize: '1.1rem', fontFamily: 'inherit', outline: 'none', background: 'transparent', color: '#1e293b'
                                    }}
                                />
                            </div>
                            <button className="btn btn-primary" style={{ padding: '16px 45px', fontSize: '1.1rem', borderRadius: '40px' }}>
                                Trouver
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION RESTAURANTS --- */}
            <section style={{ padding: '100px 0', background: '#f1f5f9' }}>
                <div className="container">
                    <div className="flex-between" style={{ marginBottom: '50px', alignItems: 'flex-end' }}>
                        <div>
                            <span style={{ color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem', display: 'block', marginBottom: '10px' }}>Découverte</span>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>Nos Restaurants Partenaires</h2>
                        </div>
                        <Link to="/restaurants" className="btn btn-secondary" style={{ borderRadius: '50px', padding: '12px 24px', borderColor: '#cbd5e1', background: 'white', color: '#334155' }}>
                            Tout voir <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                        </Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                        {restaurants.length === 0 ? <p>Chargement des restaurants...</p> :
                            restaurants.map((restau, index) => (
                                <Link key={restau._id} to={`/restaurant/${restau._id}`} style={{ textDecoration: 'none' }}>
                                    <div className="hover-card" style={{
                                        background: 'white', borderRadius: '24px', overflow: 'hidden', height: '100%',
                                        display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                                    }}>
                                        <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                                            <img src={`https://images.unsplash.com/photo-${index % 2 === 0 ? '1559339352-11d035aa65de' : '1517248135467-4c7edcad34c4'}?q=80&w=800&auto=format&fit=crop`}
                                                alt="Restaurant"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                            />
                                            <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'white', padding: '6px 14px', borderRadius: '30px', fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                                ⭐ 4.8
                                            </div>
                                        </div>

                                        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>
                                                {restau.name || restau.nom}
                                            </h3>
                                            <p style={{ color: '#475569', fontSize: '1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Utensils size={16} /> {restau.cuisine}
                                            </p>

                                            <div style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
                                                    <MapPin size={16} /> {restau.adresse || restau.adress?.city || 'Paris'}
                                                </span>
                                                <span className="btn" style={{
                                                    background: '#dcfce7', color: '#166534', padding: '8px 18px', fontSize: '0.9rem', borderRadius: '12px'
                                                }}>
                                                    Réserver
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            </section>

            {/* --- CONTACT & FOOTER --- */}
            <footer style={{ background: '#0f172a', color: 'white', paddingTop: '80px', paddingBottom: '40px' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '50px', marginBottom: '60px' }}>

                        {/* Brand */}
                        <div>
                            <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '20px', background: 'linear-gradient(to right, #db2777, #f97316)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Click&Book</h3>
                            <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>
                                La plateforme nouvelle génération pour réserver vos tables préférées en toute simplicité.
                            </p>
                        </div>

                        {/* Liens Rapides */}
                        <div>
                            <h4 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '20px' }}>Explorez</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <li><Link to="/restaurants" style={{ color: '#cbd5e1' }}>Tous les restaurants</Link></li>
                                <li><Link to="/login" style={{ color: '#cbd5e1' }}>Connexion</Link></li>
                                <li><Link to="/register" style={{ color: '#cbd5e1' }}>Inscription Restaurateur</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div id="contact">
                            <h4 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '20px' }}>Contactez-nous</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
                                    <Mail size={18} color="#db2777" />
                                    <span>hello@clickandbook.com</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
                                    <Phone size={18} color="#db2777" />
                                    <span>+33 1 23 45 67 89</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
                                    <MapPin size={18} color="#db2777" />
                                    <span>10 Rue de Rivoli, Paris</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #1e293b', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>© 2025 Click&Book. Tous droits réservés.</p>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <Instagram size={20} color="#94a3b8" style={{ cursor: 'pointer' }} />
                            <Facebook size={20} color="#94a3b8" style={{ cursor: 'pointer' }} />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
