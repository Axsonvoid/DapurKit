import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus } from 'lucide-react';

export default function Checkout() {
  const { cart, plan, totalPrice, clearCart } = useCart();
  const { addresses, addAddress, user } = useUser();
  const navigate = useNavigate();
  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0]?.id || '');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: 'Rumah', street: '', city: 'Jakarta', postalCode: '' });

  if (!plan || cart.length === 0) {
    navigate('/recipes');
    return null;
  }

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!newAddress.street) return;
    addAddress(newAddress);
    setNewAddress({ label: 'Rumah', street: '', city: 'Jakarta', postalCode: '' });
    setShowNewAddressForm(false);
  };

  const handleContinueToPayment = () => {
    if (!selectedAddress && addresses.length === 0) {
      alert('Silakan tambahkan alamat terlebih dahulu');
      return;
    }
    // Store selected address in sessionStorage for payment page
    const addressToUse = selectedAddress || addresses[0];
    sessionStorage.setItem('checkoutAddress', JSON.stringify(addressToUse));
    navigate('/payment');
  };

  const [errors, setErrors] = useState({});
  const validate = () => {
    const newErrors = {};
    if (!selectedAddress && addresses.length === 0) newErrors.address = 'Pilih atau tambah alamat';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
    // In form, show {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6">Checkout</h1>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Address selection */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MapPin size={20} /> Alamat Pengiriman</h2>
            {addresses.length === 0 && !showNewAddressForm && (
              <p className="text-gray-500 mb-3">Belum ada alamat. Silakan tambah.</p>
            )}
            {addresses.length > 0 && (
              <div className="space-y-2 mb-4">
                {addresses.map(addr => (
                  <label key={addr.id} className="flex items-start gap-2 p-2 border rounded-lg cursor-pointer">
                    <input type="radio" name="address" value={addr.id} checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} className="mt-1" />
                    <div>
                      <p className="font-semibold">{addr.label}</p>
                      <p className="text-sm text-gray-600">{addr.street}, {addr.city} {addr.postalCode}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
            <button onClick={() => setShowNewAddressForm(!showNewAddressForm)} className="text-secondary text-sm flex items-center gap-1"><Plus size={14} /> Tambah Alamat Baru</button>
            {showNewAddressForm && (
              <form onSubmit={handleAddressSubmit} className="mt-4 border-t pt-4">
                <input placeholder="Label (Rumah/Kantor)" className="w-full border rounded-lg p-2 mb-2" value={newAddress.label} onChange={e => setNewAddress({...newAddress, label: e.target.value})} required />
                <input placeholder="Jalan & Detail" className="w-full border rounded-lg p-2 mb-2" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} required />
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input placeholder="Kota" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="border rounded-lg p-2" />
                  <input placeholder="Kode Pos" value={newAddress.postalCode} onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})} className="border rounded-lg p-2" />
                </div>
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">Simpan & Gunakan</button>
              </form>
            )}
          </div>

          {/* Right: Order summary */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Ringkasan Pesanan</h2>
            <div className="space-y-2 text-sm">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>{formatRupiah(plan.pricePerServing * plan.servings)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                <span>Total</span>
                <span className="text-primary">{formatRupiah(totalPrice)}</span>
              </div>
            </div>
            <button onClick={handleContinueToPayment} className="mt-6 w-full bg-secondary text-white py-3 rounded-full font-semibold hover:bg-orange-600 transition">
              Lanjut ke Pembayaran
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}