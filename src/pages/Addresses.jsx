import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { MapPin, Plus, Trash2 } from 'lucide-react';

export default function Addresses() {
  const { addresses, addAddress, removeAddress } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: 'Rumah', street: '', city: 'Jakarta', postalCode: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newAddress.street) return;
    addAddress(newAddress);
    setNewAddress({ label: 'Rumah', street: '', city: 'Jakarta', postalCode: '' });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Alamat Saya</h1>
          <button onClick={() => setShowForm(!showForm)} className="bg-secondary text-white px-4 py-2 rounded-full flex items-center gap-1 text-sm">
            <Plus size={16} /> Tambah Alamat
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl shadow mb-6">
            <input placeholder="Label (Rumah/Kantor)" className="w-full border rounded-lg p-2 mb-2" value={newAddress.label} onChange={e => setNewAddress({...newAddress, label: e.target.value})} required />
            <input placeholder="Jalan & Detail" className="w-full border rounded-lg p-2 mb-2" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} required />
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input placeholder="Kota" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="border rounded-lg p-2" />
              <input placeholder="Kode Pos" value={newAddress.postalCode} onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})} className="border rounded-lg p-2" />
            </div>
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">Simpan</button>
          </form>
        )}

        {addresses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow">
            <MapPin size={48} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">Belum ada alamat tersimpan.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map(addr => (
              <div key={addr.id} className="bg-white p-4 rounded-2xl shadow flex justify-between items-center">
                <div>
                  <p className="font-semibold">{addr.label}</p>
                  <p className="text-sm text-gray-600">{addr.street}, {addr.city}, {addr.postalCode}</p>
                </div>
                <button onClick={() => removeAddress(addr.id)} className="text-red-500"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}