import axios from 'axios';

// --- CONFIGURATION : BASE DE DONNÉES LOCALE (BROWSER) ---
// Remplace le Backend défaillant par une sauvegarde dans le navigateur.
const USE_LOCAL_STORAGE_DB = false;

// --- MINI MOTEUR DE BASE DE DONNÉES (LOCALSTORAGE) ---
const DB = {
    get: (collection) => JSON.parse(localStorage.getItem(collection)) || [],
    save: (collection, data) => localStorage.setItem(collection, JSON.stringify(data)),
    insert: (collection, item) => {
        const data = DB.get(collection);
        item._id = Math.random().toString(36).substr(2, 9);
        item.createdAt = new Date().toISOString();
        data.push(item);
        DB.save(collection, data);
        return item;
    },
    findOne: (collection, query) => {
        const data = DB.get(collection);
        return data.find(item => Object.keys(query).every(key => item[key] === query[key]));
    },
    findById: (collection, id) => DB.get(collection).find(i => i._id === id),
    update: (collection, id, updates) => {
        const data = DB.get(collection);
        const index = data.findIndex(i => i._id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updates };
            DB.save(collection, data);
            return data[index];
        }
        return null;
    }
};

// Initialisation des collections si vides
if (!localStorage.getItem('users')) DB.save('users', []);
if (!localStorage.getItem('restaurants')) DB.save('restaurants', []); // Nom 'restaurants' pour la DB locale
if (!localStorage.getItem('reservations')) DB.save('reservations', []);


// --- INTERCEPTEUR OU API RÉELLE ---
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
});

// services/api.js
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // Vérifie que ton middleware auth côté Node lit bien ce nom de header !
        config.headers['x-auth-token'] = token; 
    }
    return config;
});

// --- FONCTIONS HYBRIDES (MOCK PERSISTANT vs RÉEL) ---

// Helper pour simuler un délai réseau (réalisme)
const delay = () => new Promise(resolve => setTimeout(resolve, 600));

// --- 1. Authenticaton ---
export const loginUser = async (email, password) => {
    if (USE_LOCAL_STORAGE_DB) {
        await delay();
        const user = DB.findOne('users', { email, password }); // Password en clair pour le mock (c'est une démo)
        if (!user) throw { response: { data: { msg: "Identifiants invalides (Local DB)" } } };

        // Faux token qui contient l'ID user
        const token = `mock_token_${user._id}`;
        localStorage.setItem('currentUser', JSON.stringify(user)); // Pour récupérer facilement
        return { token, user };
    }
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    return res.data;
};

export const registerUser = async (userData) => {
    if (USE_LOCAL_STORAGE_DB) {
        await delay();
        const exists = DB.findOne('users', { email: userData.email });
        if (exists) throw { response: { data: { msg: "Cet email existe déjà (Local DB)" } } };

        const newUser = DB.insert('users', { ...userData });
        const token = `mock_token_${newUser._id}`;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return { token, user: newUser };
    }
    const res = await api.post('/auth/register', userData);
    localStorage.setItem('token', res.data.token); // ✅ stocker le token
    return res.data;
};

export const getAuthUser = async () => {
    if (USE_LOCAL_STORAGE_DB) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) throw { response: { status: 401 } };
        return user;
    }
    const res = await api.get('/auth/profil');
    return res.data;
};

// --- 2. Restaurants (Côté Restaurateur) ---
export const getRestaurantProfile = async () => {
    if (USE_LOCAL_STORAGE_DB) {
        await delay();
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const restau = DB.findOne('restaurants', { owner: user._id });
        return restau || null; // Retourne null si pas encore créé, le frontend gèrera
    }
    const res = await api.get('/restau/profil');
    return res.data;
};

export const updateRestaurantProfile = async (profileData) => {
    if (USE_LOCAL_STORAGE_DB) {
        await delay();
        const user = JSON.parse(localStorage.getItem('currentUser'));
        let restau = DB.findOne('restaurants', { owner: user._id });

        if (restau) {
            restau = DB.update('restaurants', restau._id, profileData);
        } else {
            // Création
            restau = DB.insert('restaurants', {
                ...profileData,
                owner: user._id,
                status: 'valide', // Auto-validé pour la démo
                planImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000&auto=format&fit=crop"
            });
        }
        return restau;
    }
    const res = await api.post('/restau/profil', profileData);
    return res.data;
};

export const updateRestaurantPlan = async (planData) => {
    if (USE_LOCAL_STORAGE_DB) {
        await delay();
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const restau = DB.findOne('restaurants', { owner: user._id });
        if (!restau) throw { message: "Restau introuvable" };

        // On sauvegarde les tables dans le profil restaurant directement pour simplifier
        DB.update('restaurants', restau._id, { tables: planData.tables });
        return { msg: "Plan mis à jour", tables: planData.tables };
    }
    const res = await api.put('/restau/plan', planData);
    return res.data;
};

export const getRestaurantReservations = async () => {
    if (USE_LOCAL_STORAGE_DB) {
        await delay();
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const restau = DB.findOne('restaurants', { owner: user._id });
        if (!restau) return [];

        // Trouver toutes les réservations pour ce resto
        const allRes = DB.get('reservations');
        const myRes = allRes.filter(r => r.restaurantId === restau._id);
        return myRes;
    }
    const res = await api.get('/restau/profil/reservation');
    return res.data;
};

export const updateReservationStatus = async (id, status) => {
    if (USE_LOCAL_STORAGE_DB) {
        await delay();
        const updated = DB.update('reservations', id, { status });
        return updated;
    }
    const res = await api.put(`/restau/reservation/${id}/status`, { status });
    return res.data;
};

// --- 3. Client Public & Réservation ---

export const getRestaurants = async () => {
    if (USE_LOCAL_STORAGE_DB) {
        await delay();
        return DB.get('restaurants'); // Retourne tous les restos créés
    }
    const res = await api.get('/restau'); // Correction: la route backend est /api/restau
    return res.data;
};

export const getActivePlanForClient = async (restaurantId) => {
    if (USE_LOCAL_STORAGE_DB) {
        await delay();
        const restau = DB.findById('restaurants', restaurantId);
        if (!restau) throw { message: "Restau introuvable" };

        // Générer les positions basées sur les tables sauvegardées
        let positions = [];
        if (restau.tables && restau.tables.length > 0) {
            positions = restau.tables.map(t => ({
                tableId: t._id || t.id,
                tableNumber: t.tableNumber || 0,
                capacity: t.capacity || 2,
                x: t.x || 100, y: t.y || 100, rotation: t.rotation || 0,
                status: 'available'
            }));
        } else {
            // Fallback si le restaurateur n'a pas fait son plan
            positions = [
                { tableId: "t1", tableNumber: 1, capacity: 2, x: 100, y: 100, rotation: 0, status: "available" },
                { tableId: "t2", tableNumber: 2, capacity: 4, x: 250, y: 250, rotation: 45, status: "available" },
                { tableId: "t3", tableNumber: 3, capacity: 6, x: 400, y: 120, rotation: 0, status: "available" }
            ];
        }

        return {
            planImage: restau.planImage || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000&auto=format&fit=crop",
            positions
        };
    }
    const res = await api.get(`/client/${restaurantId}/plan`);
    return res.data;
};

export const createReservation = async (data) => {
    if (USE_LOCAL_STORAGE_DB) {
        await delay();
        const user = JSON.parse(localStorage.getItem('currentUser')); // User connecté (Client)

        // 1. CHERCHER LE RESTAURANT D'ABORD ET CORRECTEMENT
        // On s'assure de récupérer le bon objet
        const restau = DB.findById('restaurants', data.restaurantId);

        // 2. PRÉPARER LES INFOS DU RESTO POUR L'AFFICHAGE
        const restauInfo = restau
            ? { name: restau.name, adress: restau.adress }
            : { name: "Restaurant (ID: " + data.restaurantId + ")", adress: "Adresse inconnue" };

        // 3. CRÉER LA RÉSERVATION COMPLÈTE
        const newRes = DB.insert('reservations', {
            ...data,
            numberOfGuests: data.numberOfGuests || 2,
            user: user ? { _id: user._id, nom: user.name || user.nom, email: user.email } : { nom: "Invité", email: "invite@test.com" },
            status: "attente",
            restau: restauInfo // C'est ici que ça se joue
        });

        return newRes;
    }
    const res = await api.post(`/reservation`, { // Correction path /api/reservation
        restauId: data.restaurantId,
        ...data
    });
    return res.data;
};

// --- NOUVEAU : Récupérer les réservations d'un client (Pour ClientProfile) ---
export const getClientReservations = async () => {
    if (USE_LOCAL_STORAGE_DB) {
        await delay();
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) return [];
        const allRes = DB.get('reservations');
        // Filtrer celles faites par ce user
        return allRes.filter(r => r.user?._id === user._id);
    }
    const res = await api.get('/reservation/profil');
    return res.data;
};

export const checkAvailability = async (restaurantId, date, time, guests) => {
    if (USE_LOCAL_STORAGE_DB) {
        return { msg: "Disponible (Local)", availableTables: [] };
    }
    const res = await api.get(`/client/${restaurantId}/disponibility`, { params: { date, time, guests } });
    return res.data;
};

export const updateTableStatus = async (tableId, isAvailable) => {
    if (USE_LOCAL_STORAGE_DB) return { msg: "OK" };
    const res = await api.put(`/restau/tables/${tableId}/status`, { isAvailable });
    return res.data;
};

export default api;
