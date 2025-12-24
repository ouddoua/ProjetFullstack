import React, { useEffect, useState } from 'react';
import { ArrowRight, Search, Star, MapPin, Clock, Utensils, Award, CalendarCheck, ShieldCheck } from 'lucide-react';
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
                {/* Background Video/Image avec Parallax efffect */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: -2,
                    filter: 'brightness(0.9)'
                }} className="animate-float" /> {/* Légère animation de fond */}

                {/* Overlay Dégradé Premium */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(51, 65, 85, 0.7) 100%)',
                    zIndex: -1,
                    backdropFilter: 'blur(3px)'
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
                                border: '1px solid rgba(255,255,255,0.2)',
                                display: 'flex', alignItems: 'center', gap: '10px',
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)'
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
                            background: 'linear-gradient(to right, #ffffff, #e2e8f0)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent'
                        }}>
                            Réservez l'excellence <br />
                            <span style={{
                                background: 'linear-gradient(to right, #fbbf24, #f97316, #db2777)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                            }}>en un clic.</span>
                        </h1>

                        <p className="animate-fade-in-up delay-200" style={{
                            fontSize: '1.35rem', color: '#cbd5e1', marginBottom: '50px',
                            lineHeight: 1.6, maxWidth: '750px', marginInline: 'auto', fontWeight: 300
                        }}>
                            Une sélection exclusive des meilleures tables.
                            Vérifiez la disponibilité en temps réel, réservez instantanément et profitez.
                        </p>

                        {/* Search Box Flottante & Interactive */}
                        <div className="animate-fade-in-up delay-300" style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            padding: '12px',
                            borderRadius: '50px',
                            display: 'flex',
                            gap: '10px',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            maxWidth: '800px',
                            margin: '0 auto 60px auto',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255,255,255,0.5)'
                        }}>
                            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <Search size={24} color="var(--color-primary)" style={{ marginLeft: '20px', minWidth: '24px' }} />
                                <input type="text" placeholder="Rechercher 'Gastronomique', 'Lyon', 'Sushi'..."
                                    style={{
                                        width: '100%', padding: '16px 20px', border: 'none',
                                        fontSize: '1.1rem', fontFamily: 'inherit', outline: 'none', background: 'transparent'
                                    }}
                                />
                            </div>
                            <div style={{ height: '40px', width: '1px', background: '#e2e8f0', alignSelf: 'center' }}></div>
                            <div style={{ flex: 0.5, display: 'none', mdDisplay: 'flex', alignItems: 'center', paddingLeft: '20px' }}>
                                <MapPin size={20} color="var(--color-text-muted)" />
                                <input type="text" placeholder="Localisation" style={{ border: 'none', background: 'transparent', padding: '10px', fontSize: '1rem', outline: 'none' }} />
                            </div>
                            <button className="btn btn-primary" style={{ padding: '16px 45px', fontSize: '1.1rem', borderRadius: '40px' }}>
                                Trouver
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex-center animate-fade-in-up delay-300" style={{ gap: '40px', flexWrap: 'wrap' }}>
                            {[
                                { icon: CalendarCheck, text: "Réservation instantanée" },
                                { icon: ShieldCheck, text: "Garantie sans frais cachés" },
                                { icon: Star, text: "Avis vérifiés par la communauté" }
                            ].map((item, i) => (
                                <div key={i} className="flex-center" style={{ gap: '10px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                                    <item.icon size={20} color="#fbbf24" />
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION FONCTIONNALITÉS --- */}
            <section style={{ padding: '100px 0', background: 'white', position: 'relative' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 className="section-title">Pourquoi nous choisir ?</h2>
                        <p style={{ fontSize: '1.2rem', marginTop: '15px' }}>L'expérience de réservation réinventée pour vous.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                        {[
                            { icon: Utensils, title: "Large Choix", text: "Plus de 10 000 restaurants partenaires à travers toute la France." },
                            { icon: Clock, title: "Temps Réel", text: "Accédez aux disponibilités réelles et réservez en 3 secondes." },
                            { icon: Award, title: "Programme Fidélité", text: "Cumulez des points Yums à chaque réservation et gagnez des repas gratuits." }
                        ].map((item, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">
                                    <item.icon size={30} />
                                </div>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>{item.title}</h3>
                                <p style={{ lineHeight: 1.6 }}>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECTION POPULAIRE --- */}
            <section style={{ padding: '100px 0', background: '#f8fafc' }}>
                <div className="container">
                    <div className="flex-between" style={{ marginBottom: '50px', alignItems: 'flex-end' }}>
                        <div>
                            <span style={{ color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem', display: 'block', marginBottom: '10px' }}>Sélection du Chef</span>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b' }}>Les Incontournables</h2>
                        </div>
                        <Link to="/restaurants" className="btn btn-secondary" style={{ borderRadius: '50px', padding: '12px 24px' }}>
                            Explorer tout <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                        </Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                        {restaurants.length === 0 ? <p>Chargement des pépites culinaires...</p> :
                            restaurants.map((restau, index) => (
                                <Link key={restau._id} to={`/restaurant/${restau._id}`} style={{ textDecoration: 'none' }}>
                                    <div className="hover-card" style={{
                                        background: 'white', borderRadius: '24px', overflow: 'hidden', height: '100%',
                                        display: 'flex', flexDirection: 'column', border: '1px solid #f1f5f9'
                                    }}>
                                        <div style={{ height: '250px', overflow: 'hidden', position: 'relative' }}>
                                            <img src={`https://images.unsplash.com/photo-${index % 2 === 0 ? '1559339352-11d035aa65de' : '1517248135467-4c7edcad34c4'}?q=80&w=800&auto=format&fit=crop`}
                                                alt="Restaurant"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                            />
                                            <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.95)', padding: '6px 14px', borderRadius: '30px', fontWeight: 800, fontSize: '0.9rem', color: '#1e293b', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Star size={14} fill="#fbbf24" color="#fbbf24" /> 4.{8 - (index % 3)}
                                            </div>
                                            <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'var(--gradient-primary)', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>
                                                Best Seller
                                            </div>
                                        </div>

                                        <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                                                    {restau.name || restau.nom}
                                                </h3>
                                            </div>

                                            <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Utensils size={16} /> {restau.cuisine} • €€€
                                            </p>

                                            <div style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
                                                    <MapPin size={16} /> {restau.adresse || restau.adress?.city || 'Paris'}
                                                </span>
                                                <span className="btn" style={{
                                                    background: '#f0fdf4', color: '#166534', padding: '8px 20px', fontSize: '0.9rem', borderRadius: '12px'
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
        </div>
    );
};

export default Home;
