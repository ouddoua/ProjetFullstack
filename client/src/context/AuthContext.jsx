import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getAuthUser } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Charger l'utilisateur au démarrage si un token existe
    useEffect(() => {
        const loadUser = async () => {
            if (localStorage.getItem('token')) {
                try {
                    const userData = await getAuthUser();
                    setUser(userData);
                } catch (err) {
                    console.error("Erreur chargement user:", err);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        const data = await loginUser(email, password);
        localStorage.setItem('token', data.token);
        // On récupère ensuite les infos complètes de l'user
        const userData = await getAuthUser();
        setUser(userData);
        return userData; // Retourne l'user pour redirection éventuelle
    };

    const register = async (userData) => {
        const data = await registerUser(userData);
        localStorage.setItem('token', data.token);
        const user = await getAuthUser();
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
