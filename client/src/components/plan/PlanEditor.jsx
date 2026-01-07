import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { uploadPlanImage, saveRestaurantPlan, getRestaurantPlan } from '../../services/api';
import './plan.css';
import { Save, Plus, Upload, Trash2, Layout, Square, Circle } from 'lucide-react';

const TableNode = ({ table, isSelected, onSelect, onDelete, onUpdatePosition }) => {
    const nodeRef = useRef(null);

    // Scale size based on capacity (simple heuristic)
    const size = 40 + (table.capacity * 4);

    return (
        <Draggable
            nodeRef={nodeRef}
            defaultPosition={{ x: table.x, y: table.y }}
            onStop={(e, data) => onUpdatePosition(table.tableNumber, data.x, data.y)}
            bounds="parent"
        >
            <div
                ref={nodeRef}
                className={`table-node ${isSelected ? 'table-selected' : ''}`}
                onClick={(e) => { e.stopPropagation(); onSelect(table); }}
                style={{ width: size, height: size, opacity: table.isAvailable === false ? 0.6 : 1 }}
            >
                <div className={`table-shape ${table.shape || 'rect'}`} style={{ width: '100%', height: '100%', backgroundColor: table.isAvailable === false ? '#fee2e2' : 'white', borderColor: table.isAvailable === false ? '#ef4444' : '#333' }}>
                    {table.tableNumber}
                </div>
                {isSelected && (
                    <button
                        className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-md z-20"
                        onClick={(e) => { e.stopPropagation(); onDelete(table.tableNumber); }}
                        title="Supprimer"
                    >
                        <Trash2 size={12} />
                    </button>
                )}
                <div className="table-info">{table.capacity} pers.</div>
            </div>
        </Draggable>
    );
};

const PlanEditor = () => {
    const [plan, setPlan] = useState({ name: 'Mon Plan', imageUrl: '' });
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getRestaurantPlan();
            if (data && data.plan) {
                setPlan(data.plan);
                setTables(data.tables || []);
            }
        } catch (error) {
            console.error("Erreur chargement plan:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await uploadPlanImage(formData);
            setPlan(prev => ({ ...prev, imageUrl: res.imageUrl })); // Use absolute URL logic in component if needed, but relative usually works
        } catch (error) {
            console.error("Upload failed", error);
            alert("Erreur upload image");
        }
    };

    const addTable = (shape) => {
        const newNumber = tables.length > 0 ? Math.max(...tables.map(t => t.tableNumber)) + 1 : 1;
        const newTable = {
            tableNumber: newNumber,
            capacity: 4,
            x: 50,
            y: 50,
            shape: shape, // 'rect' or 'round'
            rotation: 0,
            isAvailable: true // Default to true
        };
        setTables([...tables, newTable]);
        setSelectedTable(newTable);
    };

    const updateTablePosition = (tableNumber, x, y) => {
        setTables(prev => prev.map(t =>
            t.tableNumber === tableNumber ? { ...t, x, y } : t
        ));
    };

    const updateTableCapacity = (capacity) => {
        if (!selectedTable) return;
        setTables(prev => prev.map(t =>
            t.tableNumber === selectedTable.tableNumber ? { ...t, capacity: parseInt(capacity) } : t
        ));
        setSelectedTable(prev => ({ ...prev, capacity: parseInt(capacity) }));
    };

    const updateTableAvailability = (isAvailable) => {
        if (!selectedTable) return;
        setTables(prev => prev.map(t =>
            t.tableNumber === selectedTable.tableNumber ? { ...t, isAvailable } : t
        ));
        setSelectedTable(prev => ({ ...prev, isAvailable }));
    };

    const deleteTable = (tableNumber) => {
        setTables(prev => prev.filter(t => t.tableNumber !== tableNumber));
        if (selectedTable?.tableNumber === tableNumber) setSelectedTable(null);
    };

    const savePlan = async () => {
        try {
            setSaving(true);
            const payload = {
                name: plan.name,
                imageUrl: plan.imageUrl,
                tables: tables
            };
            await saveRestaurantPlan(payload);
            alert("Plan sauvegardé !");
        } catch (error) {
            console.error("Erreur sauvegarde:", error);
            alert("Erreur lors de la sauvegarde.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Chargement du plan...</div>;

    // Use a robust base URL for images. If imageUrl starts with /, it's relative to domain.
    const bgImage = plan.imageUrl
        ? (plan.imageUrl.startsWith('http') ? plan.imageUrl : `http://localhost:5000${plan.imageUrl}`)
        : null;

    return (
        <div className="flex flex-col h-full">
            <div className="plan-toolbar justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Layout className="w-5 h-5" /> Éditeur de Salle
                    </h2>

                    <div className="w-px h-8 bg-gray-300 mx-2"></div>

                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 transition"
                    >
                        <Upload size={16} /> Image de fond
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                    />

                    <div className="w-px h-8 bg-gray-300 mx-2"></div>

                    <button onClick={() => addTable('rect')} className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                        <Plus size={16} /> <Square size={16} /> Carrée
                    </button>
                    <button onClick={() => addTable('round')} className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200">
                        <Plus size={16} /> <Circle size={16} /> Ronde
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    {selectedTable && (
                        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded border shadow-sm">
                            <span className="text-sm font-bold">Table #{selectedTable.tableNumber}</span>
                            <div className="flex flex-col text-xs gap-1">
                                <label className="flex items-center gap-1">
                                    <span style={{ width: '60px' }}>Capacité:</span>
                                    <input
                                        type="number"
                                        min="1"
                                        value={selectedTable.capacity}
                                        onChange={(e) => updateTableCapacity(e.target.value)}
                                        className="w-16 border rounded px-1"
                                    />
                                </label>
                                <label className="flex items-center gap-1 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedTable.isAvailable !== false}
                                        onChange={(e) => updateTableAvailability(e.target.checked)}
                                    />
                                    <span>Disponible</span>
                                </label>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={savePlan}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow transition"
                    >
                        <Save size={18} /> {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                </div>
            </div>

            <div style={{ overflow: 'auto', flex: 1, display: 'flex', justifyContent: 'center', padding: '20px', background: '#e2e8f0' }}>
                <div
                    className="plan-container relative shadow-inner"
                    style={{
                        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                    }}
                    onClick={() => setSelectedTable(null)}
                >
                    {!bgImage && (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <Upload size={48} className="mx-auto mb-2 opacity-50" />
                                <p>Uploadez un plan 2D (blueprint) pour commencer</p>
                            </div>
                        </div>
                    )}

                    {tables.map(table => (
                        <TableNode
                            key={table.tableNumber}
                            table={table}
                            isSelected={selectedTable?.tableNumber === table.tableNumber}
                            onSelect={setSelectedTable}
                            onDelete={deleteTable}
                            onUpdatePosition={updateTablePosition}
                            isAvailable={table.isAvailable} // Ensure visual feedback
                        />
                    ))}
                </div>
            </div>
            <div className="px-4 pb-4 text-xs text-gray-500">
                Astuce : Cliquez sur une table pour modifier sa capacité. Glissez pour déplacer.
            </div>
        </div>
    );
};

export default PlanEditor;
