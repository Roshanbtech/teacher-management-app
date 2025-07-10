import React, { useState } from "react";
import { Qualification } from "../types";
import { Plus, Edit2, Trash2, Eye, EyeOff, DollarSign, BookOpen } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface QualificationsProps {
  qualifications: Qualification[];
  onChange: (qualifications: Qualification[]) => void;
  readonly?: boolean;
}
const defaultQual: Omit<Qualification, "id"> = {
  name: "",
  rate: 0,
  currency: "USD",
  type: "private",
  description: "",
  requirements: [],
  isActive: true,
};
const Qualifications: React.FC<QualificationsProps> = ({
  qualifications,
  onChange,
  readonly = false,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newQual, setNewQual] = useState<Omit<Qualification, "id">>(defaultQual);

  // Add Qualification
  function handleAdd() {
    if (!newQual.name.trim() || newQual.rate <= 0) return;
    onChange([...qualifications, { ...newQual, id: uuidv4() }]);
    setNewQual(defaultQual);
    setIsAdding(false);
  }
  // Delete Qualification
  function handleDelete(id: string) {
    onChange(qualifications.filter(q => q.id !== id));
  }
  // Toggle Active
  function handleToggle(id: string) {
    onChange(
      qualifications.map(q => (q.id === id ? { ...q, isActive: !q.isActive } : q))
    );
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <div className="text-md font-semibold flex items-center gap-2">
          <BookOpen size={18} />
          Qualifications and Rates
          <span className="ml-2 px-2 bg-blue-100 text-blue-800 text-xs rounded-full">
            {qualifications.length}
          </span>
        </div>
        {!readonly && (
          <button className="text-blue-600 flex items-center gap-1 hover:bg-blue-50 rounded px-2 py-1 text-sm" onClick={() => setIsAdding(true)}>
            <Plus size={16} /> Add
          </button>
        )}
      </div>
      {isAdding && (
        <div className="bg-blue-50 border p-4 rounded-lg mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            <input type="text" className="border px-2 py-1 rounded" placeholder="Name" value={newQual.name} onChange={e => setNewQual({ ...newQual, name: e.target.value })} />
            <input type="number" className="border px-2 py-1 rounded w-20" placeholder="Rate" value={newQual.rate} onChange={e => setNewQual({ ...newQual, rate: parseFloat(e.target.value) })} />
            <select className="border px-2 py-1 rounded" value={newQual.currency} onChange={e => setNewQual({ ...newQual, currency: e.target.value })}>
              <option value="USD">USD</option>
              <option value="INR">INR</option>
              <option value="EUR">EUR</option>
            </select>
            <select className="border px-2 py-1 rounded" value={newQual.type} onChange={e => setNewQual({ ...newQual, type: e.target.value as "private" | "group" })}>
              <option value="private">Private</option>
              <option value="group">Group</option>
            </select>
            <input type="text" className="border px-2 py-1 rounded" placeholder="Description" value={newQual.description} onChange={e => setNewQual({ ...newQual, description: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white rounded px-3 py-1" onClick={handleAdd}>Add</button>
            <button className="bg-gray-300 rounded px-3 py-1" onClick={() => setIsAdding(false)}>Cancel</button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {qualifications.map(q => (
          <div key={q.id} className={`p-4 rounded-lg border ${q.isActive ? "bg-white" : "bg-gray-100 opacity-70"}`}>
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-blue-400" />
              <span className="font-semibold">{q.name}</span>
              <span className="ml-auto text-green-700 font-semibold flex items-center gap-1">
                <DollarSign size={14} /> {q.rate} {q.currency}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 ml-2">
                {q.type.charAt(0).toUpperCase() + q.type.slice(1)}
              </span>
            </div>
            <div className="text-xs text-gray-600 mt-1">{q.description}</div>
            <div className="flex gap-2 mt-2">
              {!readonly && (
                <>
                  <button onClick={() => handleToggle(q.id)} className="text-gray-400 hover:text-blue-700">{q.isActive ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                  <button onClick={() => handleDelete(q.id)} className="text-red-400 hover:text-red-700"><Trash2 size={15} /></button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
Qualifications.displayName = "Qualifications";
export default Qualifications;
