import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, User, Menu, X } from 'lucide-react';

export default function Layout() {
  const { cart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">dapurkit</Link>
          {/* Desktop menu */}
          <div className="hidden md:flex gap-6 items-center">
            <Link to="/recipes" className="text-gray-700 hover:text-secondary">Browse</Link>
            <Link to="/checkout" className="relative"><ShoppingBag className="text-gray-700 hover:text-secondary" />{cart.length > 0 && <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cart.length}</span>}</Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-secondary"><User size={20} /></Link>
          </div>
          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X /> : <Menu />}</button>
        </div>
        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t p-4 space-y-3 bg-white">
            <Link to="/recipes" className="block text-gray-700" onClick={() => setMobileMenuOpen(false)}>Browse</Link>
            <Link to="/checkout" className="block text-gray-700" onClick={() => setMobileMenuOpen(false)}>Cart ({cart.length})</Link>
            <Link to="/dashboard" className="block text-gray-700" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
          </div>
        )}
      </nav>
      <main className="flex-1"><Outlet /></main>
    </div>
  );
}