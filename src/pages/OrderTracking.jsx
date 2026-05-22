import { useParams, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';

export default function OrderTracking() {
  const { id } = useParams();
  const { orders } = useUser();
  const order = orders.find(o => o.id == id);
  if (!order) return <div className="text-center py-20">Pesanan tidak ditemukan. <Link to="/orders" className="text-primary">Kembali</Link></div>;

  const statusSteps = ['Processing', 'Cooking', 'Shipped', 'Delivered'];
  const currentIndex = statusSteps.indexOf(order.status);
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold text-primary mb-2">Pesanan #{order.id}</h1>
        <p className="text-gray-500 mb-6">{order.date}</p>
        <div className="relative mb-8">
          <div className="absolute top-5 left-0 w-full h-1 bg-gray-200"></div>
          <div className="absolute top-5 left-0 h-1 bg-primary transition-all" style={{ width: `${(currentIndex / (statusSteps.length-1)) * 100}%` }}></div>
          <div className="flex justify-between relative">
            {statusSteps.map((step, idx) => (
              <div key={step} className="text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${idx <= currentIndex ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {idx === 0 && <Package size={20} />}
                  {idx === 1 && <Truck size={20} />}
                  {idx === 2 && <Truck size={20} />}
                  {idx === 3 && <Home size={20} />}
                </div>
                <div className="text-xs mt-1">{step}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t pt-4"><h3 className="font-semibold">Detail Pesanan</h3>{order.items?.map((item, idx) => <div key={idx} className="flex justify-between text-sm mt-1"><span>{item.name} x{item.quantity}</span><span>{formatRupiah(order.total / order.items.length)}</span></div>)}<div className="flex justify-between font-bold mt-3"><span>Total</span><span>{formatRupiah(order.total)}</span></div></div>
        <Link to="/orders" className="inline-block mt-6 text-primary underline">← Kembali ke riwayat</Link>
      </div>
    </div>
  );
}