import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Payment() {
  const { cart, plan, totalPrice, clearCart } = useCart();
  const { addOrder, user } = useUser();
  const navigate = useNavigate();
  const [method, setMethod] = useState('credit');
  const [paymentStep, setPaymentStep] = useState('select'); // select, confirm, success
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  const handlePlaceOrder = () => {
    // Create order
    const newOrder = {
      id: Date.now(),
      date: new Date().toLocaleDateString('id-ID'),
      items: cart.map(item => ({ name: item.name, quantity: 1 })),
      total: totalPrice,
      status: 'Processing',
      paymentMethod: method,
    };
    addOrder(newOrder);
    clearCart();
    navigate('/success');
  };

  const renderPaymentForm = () => {
    if (method === 'credit') {
      return (
        <div className="space-y-3">
          <input placeholder="Nomor Kartu" className="w-full border rounded-lg p-3" />
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="MM/YY" className="border rounded-lg p-3" />
            <input placeholder="CVV" className="border rounded-lg p-3" />
          </div>
          <button onClick={handlePlaceOrder} className="w-full bg-secondary text-white py-3 rounded-full font-semibold">Bayar Sekarang</button>
        </div>
      );
    } else if (method === 'va') {
      return (
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <p className="font-semibold mb-2">Virtual Account BCA / Mandiri / BRI</p>
          <p className="text-2xl font-mono bg-white p-3 rounded border">8810 1234 5678 9012</p>
          <p className="text-sm text-gray-500 mt-2">Klik "Bayar" setelah melakukan transfer</p>
          <button onClick={handlePlaceOrder} className="mt-4 bg-secondary text-white px-6 py-2 rounded-full">Konfirmasi Pembayaran</button>
        </div>
      );
    } else if (method === 'qris') {
      return (
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <p className="font-semibold mb-2">Scan QRIS menggunakan aplikasi bank atau e-wallet</p>
          <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-400 mx-auto flex items-center justify-center text-gray-400">
            [QR Code Mockup]
          </div>
          <button onClick={handlePlaceOrder} className="mt-4 bg-secondary text-white px-6 py-2 rounded-full">Sudah Bayar</button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-primary mb-6">Pilih Metode Pembayaran</h1>
        <div className="flex gap-4 mb-6 border-b pb-4">
          <button onClick={() => setMethod('credit')} className={`px-4 py-2 rounded-full ${method === 'credit' ? 'bg-primary text-white' : 'bg-gray-100'}`}>Kartu Kredit</button>
          <button onClick={() => setMethod('va')} className={`px-4 py-2 rounded-full ${method === 'va' ? 'bg-primary text-white' : 'bg-gray-100'}`}>Virtual Account</button>
          <button onClick={() => setMethod('qris')} className={`px-4 py-2 rounded-full ${method === 'qris' ? 'bg-primary text-white' : 'bg-gray-100'}`}>QRIS</button>
        </div>
        <div className="mt-4">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="font-semibold">Total yang harus dibayar:</p>
            <p className="text-2xl font-bold text-secondary">{formatRupiah(totalPrice)}</p>
          </div>
          {renderPaymentForm()}
        </div>
      </div>
    </div>
  );
}