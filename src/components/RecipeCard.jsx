import { useCart } from '../context/CartContext';
import { Plus, Check } from 'lucide-react';

export default function RecipeCard({ recipe, onShowDetail, onAddToBox }) {
  const { addToBox, plan, cart } = useCart();
  const isInCart = cart.some(item => item.originalId === recipe.id);
  const remaining = plan ? plan.mealsPerWeek - cart.length : 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!plan) return;
    if (cart.length >= plan.mealsPerWeek) {
      alert(`Kamu sudah memilih ${plan.mealsPerWeek} resep. Hapus beberapa terlebih dahulu.`);
      return;
    }
    addToBox({ ...recipe, originalId: recipe.id });
    if (onAddToBox) onAddToBox();
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer" onClick={onShowDetail}>
      <div className="relative h-48 overflow-hidden"><img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover hover:scale-105 transition" /><div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 text-xs font-semibold text-primary">{recipe.cookTime}</div></div>
      <div className="p-4"><div className="flex justify-between items-start mb-2"><h3 className="text-xl font-bold text-primary">{recipe.name}</h3>{recipe.tags && <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">{recipe.tags[0]}</span>}</div><p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p><div className="flex justify-between items-center mt-auto pt-3 border-t"><div><span className="text-xs text-gray-500">per porsi</span><p className="text-lg font-bold text-secondary">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(plan?.pricePerServing || 28500)}</p></div><button onClick={handleAdd} disabled={isInCart} className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold ${isInCart ? 'bg-gray-200 text-gray-500' : 'bg-primary text-white hover:bg-green-800'}`}>{isInCart ? <><Check size={16} /> Sudah</> : <><Plus size={16} /> Tambah</>}</button></div></div>
    </div>
  );
}