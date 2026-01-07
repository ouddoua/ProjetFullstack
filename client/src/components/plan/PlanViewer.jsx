import React from 'react';
import './plan.css';
import { User } from 'lucide-react';

const TableNodeViewer = ({ table, status, onSelect }) => {
    // status: 'available', 'occupied', 'selected', 'hidden'

    const size = 30 + (table.capacity * 3); // Slightly smaller for viewer? Or same.

    let bgClass = "bg-gray-200 border-gray-400 text-gray-400 cursor-not-allowed"; // Default/Occupied
    if (status === 'available') bgClass = "bg-white border-green-500 text-green-700 cursor-pointer hover:bg-green-50 hover:shadow-lg hover:scale-105 transition-all";
    if (status === 'selected') bgClass = "bg-blue-600 border-blue-600 text-white shadow-lg scale-110";
    if (status === 'occupied') bgClass = "bg-red-50 border-red-200 text-red-300 cursor-not-allowed opacity-70";

    return (
        <div
            className="table-node"
            style={{
                left: table.x,
                top: table.y,
                width: size,
                height: size,
                position: 'absolute'
            }}
            onClick={(e) => {
                if (status === 'available') onSelect(table);
            }}
        >
            <div className={`table-shape ${table.shape || 'rect'} ${bgClass}`} style={{ width: '100%', height: '100%' }}>
                <span className="text-xs font-bold">{table.tableNumber}</span>
            </div>
            {status !== 'occupied' && (
                <div className="table-info flex items-center gap-1 text-[10px]">
                    <User size={8} /> {table.capacity}
                </div>
            )}
        </div>
    );
};

const PlanViewer = ({ plan, tables, onTableSelect, selectedTableId }) => {
    // plan: { imageUrl }
    // tables: [{ tableNumber, x, y, capacity, status }]

    if (!plan) return <div className="p-4 text-center text-gray-500">Plan non disponible</div>;

    const bgImage = plan.imageUrl
        ? (plan.imageUrl.startsWith('http') ? plan.imageUrl : `http://localhost:5000${plan.imageUrl}`)
        : null;

    return (
        <div
            className="plan-container relative shadow-md rounded-lg overflow-hidden border border-gray-200"
            style={{
                backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                // Removed height override, let CSS handle it
                // Width handled by CSS class .plan-container
            }}
        >
            {!bgImage && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <p>Plan de salle</p>
                </div>
            )}

            {tables.map(table => {
                let status = 'available'; // Default
                // Logic should be passed via props ideally, but if 'isAvailable' is in table data:
                if (table.isAvailable === false) status = 'occupied';
                // If capacity < guests needed? (Handled by parent filter typically)

                if (status === 'available' && selectedTableId === table._id) status = 'selected';

                return (
                    <TableNodeViewer
                        key={table._id || table.tableNumber}
                        table={table}
                        status={status} // You can enhance this with real logic
                        onSelect={onTableSelect}
                    />
                );
            })}
        </div>
    );
};

export default PlanViewer;
