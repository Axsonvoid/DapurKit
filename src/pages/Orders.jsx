import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Package, Calendar, Download } from 'lucide-react';

export default function Orders() {
  const { orders } = useUser();
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  const exportCSV = () => {
    const headers = ['Order ID', 'Date', 'Status', 'Total', 'Items'];
    const rows = orders.map(o => [o.id, o.date, o.status, formatRupiah(o.total), o.items.map(i => i.name).join(', ')]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6"><h1 className="text-3xl font-bold text-primary">Riwayat Pesanan</h1>{orders.length > 0 && <button onClick={exportCSV} className="flex items-center gap-2 bg-primary text-white px-3 py-1 rounded-full text-sm"><Download size={16} /> Export CSV</button>}</div>
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl"><Package size={48} className="mx-auto text-gray-300 mb-2" /><p>Belum ada pesanan.</p><Link to="/survey" className="inline-block mt-4 bg-secondary text-white px-4 py-2 rounded-full">Mulai Sekarang</Link></div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Link to={`/orders/${order.id}`} key={order.id} className="block bg-white rounded-2xl shadow p-5 hover:shadow-lg transition">
                <div className="flex justify-between items-start flex-wrap gap-2 border-b pb-2 mb-3"><span className="font-bold text-primary">#{order.id}</span><span className="text-sm text-gray-500 flex items-center gap-1"><Calendar size={14} /> {order.date}</span><span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span></div>
                <div className="flex justify-between mt-2"><span>Total</span><span className="font-bold text-secondary">{formatRupiah(order.total)}</span></div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}