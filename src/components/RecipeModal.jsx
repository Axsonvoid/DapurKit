import { useCart } from '../context/CartContext';
import { X, Clock, AlertCircle, Flame, Beef, Wheat, Milk, Egg, Fish, Nut } from 'lucide-react';

const allergenIcons = {
  nuts: <Nut size={16} />,
  dairy: <Milk size={16} />,
  gluten: <Wheat size={16} />,
  eggs: <Egg size={16} />,
  shellfish: <Fish size={16} />,
  soy: <Beef size={16} />,
};

export default function RecipeModal({ recipe, onClose }) {
  const { addToBox, plan, cart } = useCart();
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  const isInCart = cart.some(item => item.originalId === recipe.id);

  const handleAdd = () => {
    if (!plan) return;
    if (cart.length >= plan.mealsPerWeek) {
      alert(`Kamu sudah memilih ${plan.mealsPerWeek} resep. Hapus beberapa terlebih dahulu.`);
      return;
    }
    addToBox({ ...recipe, originalId: recipe.id });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="relative h-64 overflow-hidden">
          <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
          <button onClick={onClose} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"><X size={24} /></button>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-primary">{recipe.name}</h2>
            <span className="flex items-center gap-1 text-gray-500"><Clock size={16} /> {recipe.cookTime}</span>
          </div>
          <p className="text-gray-600 mt-2">{recipe.description}</p>
          <div className="flex gap-2 mt-3 flex-wrap">{recipe.tags.map(tag => <span key={tag} className="bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs">{tag}</span>)}</div>
          {recipe.allergens?.length > 0 && (
            <div className="mt-3 p-2 bg-yellow-50 rounded-lg flex items-start gap-2"><AlertCircle size={18} className="text-yellow-600 mt-0.5" /><div><p className="text-sm font-semibold">Mengandung alergen:</p><div className="flex gap-2 mt-1">{recipe.allergens.map(a => <span key={a} className="flex items-center gap-1 text-xs bg-yellow-100 px-2 py-1 rounded">{allergenIcons[a] || '⚠️'} {a}</span>)}</div></div></div>
          )}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm border-y py-3">
            <div><Flame size={16} className="mx-auto text-red-500" />{recipe.nutrition?.calories} kcal</div>
            <div><Beef size={16} className="mx-auto text-gray-600" />Protein {recipe.nutrition?.protein}g</div>
            <div><span className="text-xs">🥑</span> Lemak {recipe.nutrition?.fat}g</div>
          </div>
          <div className="mt-4"><h3 className="font-semibold">Cara Memasak:</h3><ol className="list-decimal list-inside text-gray-600 space-y-1 mt-1">{recipe.steps?.map((step, idx) => <li key={idx}>{step}</li>)}</ol></div>
          <div className="mt-6 flex justify-between items-center"><span className="text-2xl font-bold text-secondary">{formatRupiah(plan?.pricePerServing || 28500)}/porsi</span><button onClick={handleAdd} disabled={isInCart} className={`px-6 py-2 rounded-full font-semibold ${isInCart ? 'bg-gray-300 text-gray-500' : 'bg-primary text-white hover:bg-green-800'}`}>{isInCart ? 'Sudah di Box' : 'Tambah ke Box'}</button></div>
        </div>
      </div>
    </div>
  );
}