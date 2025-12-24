import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, UserCog, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        password: '',
        confirmPassword: '',
        telephone: '',
        role: 'client' // défaut
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { register } = useContext(AuthContext);

    const { nom, email, password, confirmPassword, telephone, role } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await register({ nom, email, password, role, telephone });

            // Redirection
            if (role === 'restaurateur') {
                navigate('/dashboard/restaurant');
            } else {
                navigate('/');
            }

        } catch (err) {
            setError(err.response?.data?.msg || err.message || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '40px' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '40px', borderRadius: '24px' }}>
                <h2 className="section-title" style={{ marginBottom: '10px' }}>Inscription</h2>
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '30px' }}>
                    Rejoignez Click&Book dès aujourd'hui
                </p>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--color-error)',
                        color: 'var(--color-error)',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={onSubmit}>
                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Nom complet</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input
                                type="text"
                                name="nom"
                                value={nom}
                                onChange={onChange}
                                className="input-field"
                                placeholder="Jean Dupont"
                                style={{ paddingLeft: '40px' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                className="input-field"
                                placeholder="jean@exemple.com"
                                style={{ paddingLeft: '40px' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Téléphone</label>
                        <div style={{ position: 'relative' }}>
                            <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input
                                type="tel"
                                name="telephone"
                                value={telephone}
                                onChange={onChange}
                                className="input-field"
                                placeholder="06 12 34 56 78"
                                style={{ paddingLeft: '40px' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Je suis un</label>
                        <div style={{ position: 'relative' }}>
                            <UserCog size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <select
                                name="role"
                                value={role}
                                onChange={onChange}
                                className="input-field"
                                style={{ paddingLeft: '40px', appearance: 'none', cursor: 'pointer' }}
                            >
                                <option value="client">Client</option>
                                <option value="restaurateur">Restaurateur</option>
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Mot de passe</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                className="input-field"
                                placeholder="••••••••"
                                style={{ paddingLeft: '40px' }}
                                required
                                minLength="6"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Confirmer le mot de passe</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={onChange}
                                className="input-field"
                                placeholder="••••••••"
                                style={{ paddingLeft: '40px' }}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '10px' }}
                        disabled={loading}
                    >
                        {loading ? 'Inscription en cours...' : 'S\'inscrire'}
                    </button>
                </form>

                <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Déjà un compte ? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Se connecter</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
