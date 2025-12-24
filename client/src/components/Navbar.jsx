import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UtensilsCrossed, LogIn, UserPlus, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const textColor = scrolled || !isHome ? 'var(--color-text)' : 'white';

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1000,
            padding: scrolled ? '10px 0' : '20px 0',
            transition: 'all 0.3s ease',
            background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.05)' : 'none',
        }}>
            <div className="container flex-between">
                <Link to="/" className="flex-center" style={{ gap: '12px', textDecoration: 'none' }}>
                    <div className="flex-center" style={{
                        width: '45px', height: '45px',
                        background: 'var(--gradient-primary)',
                        borderRadius: '14px',
                        boxShadow: '0 8px 20px -4px rgba(219, 39, 119, 0.4)'
                    }}>
                        <UtensilsCrossed color="white" size={24} />
                    </div>
                    <span style={{
                        fontSize: '1.75rem',
                        fontWeight: '800',
                        letterSpacing: '-0.5px',
                        color: textColor
                    }}>
                        Click<span style={{ color: scrolled || !isHome ? '#db2777' : '#ffd4e4' }}>&</span>Book
                    </span>
                </Link>

                <div className="flex-center" style={{ gap: '30px' }}>
                    <div className="flex-center" style={{ gap: '15px', marginLeft: '20px' }}>
                        {user ? (
                            <>
                                <Link to={user.role === 'restaurateur' ? "/dashboard/restaurant" : "/profil"} className="btn btn-primary" style={{ padding: '10px 24px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <User size={18} />
                                    {user.role === 'restaurateur' ? 'Mon Restaurant' : 'Mon Espace'}
                                </Link>
                                <button onClick={logout} className="btn" style={{
                                    background: 'transparent',
                                    color: textColor,
                                    border: scrolled || !isHome ? '2px solid #e2e8f0' : '2px solid rgba(255,255,255,0.3)',
                                    padding: '10px 16px'
                                }}>
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn" style={{
                                    background: 'transparent',
                                    color: textColor,
                                    border: scrolled || !isHome ? '2px solid #e2e8f0' : '2px solid rgba(255,255,255,0.3)',
                                    padding: '10px 24px'
                                }}>
                                    Connexion
                                </Link>
                                <Link to="/register" className="btn btn-primary" style={{ padding: '10px 24px' }}>
                                    Inscription
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;
