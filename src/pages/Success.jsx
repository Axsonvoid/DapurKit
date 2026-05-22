import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function Success() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <CheckCircle size={80} className="text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-primary mb-2">Pesanan Berhasil! 🎉</h1>
        <p className="text-gray-600 mb-6">Terima kasih telah berlangganan dapurkit. Box pertamamu akan dikirim dalam 3-5 hari kerja.</p>
        <div className="space-y-3">
          <Link to="/" className="inline-block bg-secondary text-white px-6 py-2 rounded-full">Kembali ke Beranda</Link>
          <Link to="/orders" className="inline-block text-primary underline ml-4">Lihat Pesanan Saya</Link>
        </div>
      </div>
    </div>
  );
}