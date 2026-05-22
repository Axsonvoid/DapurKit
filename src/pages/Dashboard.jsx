import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { Package, MapPin, User, ShoppingBag, Calendar, XCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function Dashboard() {
  const { user } = useUser();
  const { plan } = useCart();
  const [skipWeek, setSkipWeek] = useState(false);
  const nextBilling = new Date();
  nextBilling.setDate(nextBilling.getDate() + 7);
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-8">Selamat datang kembali, {user?.name}!</p>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/orders" className="bg-white p-6 rounded-2xl shadow hover:shadow-lg text-center"><Package size={40} className="mx-auto text-primary mb-3" /><h2 className="text-xl font-semibold">Pesanan Saya</h2><p className="text-gray-500 text-sm">Lihat riwayat pesanan</p></Link>
          <Link to="/addresses" className="bg-white p-6 rounded-2xl shadow hover:shadow-lg text-center"><MapPin size={40} className="mx-auto text-primary mb-3" /><h2 className="text-xl font-semibold">Alamat Pengiriman</h2><p className="text-gray-500 text-sm">Kelola alamat</p></Link>
          <Link to="/profile" className="bg-white p-6 rounded-2xl shadow hover:shadow-lg text-center"><User size={40} className="mx-auto text-primary mb-3" /><h2 className="text-xl font-semibold">Profil Saya</h2><p className="text-gray-500 text-sm">Ubah informasi akun</p></Link>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4 flex gap-2"><ShoppingBag /> Langganan Aktif</h2>
          {plan ? (
            <div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Paket:</span> {plan.mealsPerWeek} resep/minggu untuk {plan.servings} orang</div>
                <div><span className="text-gray-500">Harga mingguan:</span> <span className="font-bold text-secondary">{formatRupiah(plan.totalWeekly)}</span></div>
                <div className="flex items-center gap-2"><Calendar size={16} /><span className="text-gray-500">Tagihan berikutnya:</span> {nextBilling.toLocaleDateString('id-ID')}</div>
              </div>
              <div className="mt-4 flex gap-3">
                <button onClick={() => setSkipWeek(!skipWeek)} className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full ${skipWeek ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}><XCircle size={14} /> {skipWeek ? 'Skip minggu ini (aktif)' : 'Lewati minggu ini'}</button>
              </div>
              {skipWeek && <p className="text-xs text-gray-500 mt-2">Minggu depan tidak akan dikirim. Langganan akan dilanjutkan minggu berikutnya.</p>}
            </div>
          ) : (
            <p className="text-gray-600">Anda belum memiliki langganan aktif. <Link to="/survey" className="text-secondary">Mulai berlangganan</Link></p>
          )}
        </div>
      </div>
    </div>
  );
}