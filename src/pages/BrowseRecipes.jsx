import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import recipesData from '../data/recipes.json';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import { Link } from 'react-router-dom';
import { ShoppingBag, X, Trash2, Loader } from 'lucide-react';

// All recipes are imported from the JSON file
const allRecipes = recipesData;

export default function BrowseRecipes() {
  const { plan, cart, removeFromBox, totalPrice, userPreferences } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 800);
  }, []);

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 2000);
  };

  const formatRupiah = (num) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Silakan pilih paket terlebih dahulu.{' '}
        <Link to="/survey" className="text-primary underline ml-2">
          Mulai Survei →
        </Link>
      </div>
    );
  }

  // --- FILTERING LOGIC (fixed taste mapping) ---
  const userTastes = userPreferences?.taste || [];
  const userAllergens = userPreferences?.allergens || [];

  // Map English taste IDs to Indonesian tags
  const tasteToTag = {
    balanced: 'Seimbang',
    veggie: 'Vegetarian',
    lowcarb: 'Rendah Karbohidrat',
    quick: 'Cepat',
  };

  let filteredRecipes = [...allRecipes];

  // 1. Filter by taste preferences
  if (userTastes.length > 0) {
    const allowedTags = userTastes.map((t) => tasteToTag[t]);
    filteredRecipes = filteredRecipes.filter((recipe) =>
      recipe.tags.some((tag) => allowedTags.includes(tag))
    );
  }

  // 2. Filter by allergens (exclude recipes that contain any user allergen)
  if (!userAllergens.includes('no_allergy') && userAllergens.length > 0) {
    filteredRecipes = filteredRecipes.filter(
      (recipe) => !recipe.allergens.some((a) => userAllergens.includes(a))
    );
  }

  // 3. Search by name
  if (search) {
    filteredRecipes = filteredRecipes.filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // 4. Manual tag filter (from the button bar)
  if (filterTag !== 'all') {
    filteredRecipes = filteredRecipes.filter((r) => r.tags.includes(filterTag));
  }

  const remainingSlots = plan.mealsPerWeek - cart.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Toast notification */}
      {toast.show && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg z-50 animate-bounce">
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-sm border-b px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Pilih Resep Mingguan</h1>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-secondary text-white p-2 rounded-full hover:bg-orange-600"
          >
            <ShoppingBag size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterTag('all')}
            className={`px-3 py-1 rounded-full text-sm ${
              filterTag === 'all' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Semua
          </button>
          {['Seimbang', 'Vegetarian', 'Rendah Karbohidrat', 'Cepat'].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterTag === tag ? 'bg-primary text-white' : 'bg-gray-100'
                }`}
              >
                {tag}
              </button>
            )
          )}
        </div>
        <input
          type="text"
          placeholder="Cari resep..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-full px-4 py-1 text-sm w-48 focus:outline-none focus:border-primary"
        />
      </div>

      {/* Recipe grid */}
      <div className="max-w-7xl mx-auto px-4">
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">Tidak ada resep yang cocok dengan preferensimu.</p>
            <button
              onClick={() => {
                setFilterTag('all');
                setSearch('');
              }}
              className="mt-4 bg-secondary text-white px-4 py-2 rounded-full text-sm"
            >
              Reset Filter (Tag & Cari)
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onShowDetail={() => setSelectedRecipe(recipe)}
                onAddToBox={() => showToast(`${recipe.name} ditambahkan ke box!`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cart drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold flex gap-2">
                <ShoppingBag /> Box Kamu
              </h2>
              <button onClick={() => setIsCartOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-10">Belum ada resep.</p>
              ) : (
                <ul className="space-y-3">
                  {cart.map((item) => (
                    <li key={item.id} className="flex gap-3 border-b pb-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-secondary">
                          {formatRupiah(plan.pricePerServing * plan.servings)} per porsi (
                          {plan.servings} orang)
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromBox(item.id)}
                        className="text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border-t p-4 space-y-3">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatRupiah(totalPrice)}</span>
              </div>
              <div className="text-sm text-gray-500">
                Sisa slot: {remainingSlots} / {plan.mealsPerWeek}
              </div>
              <Link
                to="/checkout"
                className={`w-full block text-center py-3 rounded-full font-semibold transition ${
                  cart.length === plan.mealsPerWeek
                    ? 'bg-secondary text-white hover:bg-orange-600'
                    : 'bg-gray-300 text-gray-500 pointer-events-none'
                }`}
              >
                {cart.length === plan.mealsPerWeek
                  ? 'Lanjut ke Pembayaran'
                  : `Pilih ${remainingSlots} resep lagi`}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}
    </div>
  );
}