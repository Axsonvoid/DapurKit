import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function PlanSelection() {
  const { plan } = useCart();

  if (!plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Belum ada paket dipilih. Silakan isi survei terlebih dahulu.</p>
          <Link to="/survey" className="text-primary underline mt-4 inline-block">Ikuti Survei →</Link>
        </div>
      </div>
    );
  }

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  // Calculate savings compared to 1 meal/day base
  const basePricePerServing = 28500; // same as plan.pricePerServing
  const standardPlanWeekly = basePricePerServing * plan.servings * 7; // 1 meal/day
  const savings = plan.totalWeekly < standardPlanWeekly ? standardPlanWeekly - plan.totalWeekly : 0;

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Paket Personalisasimu</h1>
          <p className="text-xl text-gray-600">Berdasarkan selera, porsi & frekuensi</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white text-center">
            <h2 className="text-2xl font-bold">Box Mingguan</h2>
            <p className="opacity-90">Diantar segar ke rumahmu</p>
          </div>
          
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl mb-2">🍽️</div>
                <div className="text-sm text-gray-500">Masakan per minggu</div>
                <div className="text-2xl font-bold text-primary">{plan.mealsPerWeek} resep</div>
                <div className="text-xs text-gray-400">({plan.mealsPerDay} menu/hari)</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">👥</div>
                <div className="text-sm text-gray-500">Porsi per masakan</div>
                <div className="text-2xl font-bold text-primary">{plan.servings} orang</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">💰</div>
                <div className="text-sm text-gray-500">Harga per porsi</div>
                <div className="text-2xl font-bold text-primary">{formatRupiah(plan.pricePerServing)}</div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between text-lg mb-2">
                <span>Subtotal mingguan</span>
                <span className="font-semibold">{formatRupiah(plan.totalWeekly)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>Pengiriman</span>
                <span>GRATIS</span>
              </div>
              {savings > 0 && (
                <div className="bg-green-50 p-3 rounded-lg mb-4 text-green-700 text-sm flex items-center gap-2">
                  <CheckCircle size={16} />
                  Hemat {formatRupiah(savings)}/minggu dibanding paket 1 menu/hari!
                </div>
              )}
              <div className="flex justify-between text-2xl font-bold pt-4 border-t border-gray-200">
                <span>Total mingguan</span>
                <span className="text-primary">{formatRupiah(plan.totalWeekly)}</span>
              </div>
            </div>

            <Link
              to="/recipes"
              className="mt-8 w-full bg-secondary text-white py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:bg-orange-600 transition"
            >
              Pilih Resep <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Batal kapan saja • Jeda atau lewati minggu • Pengiriman gratis
          </p>
        </div>
      </div>
    </div>
  );
}