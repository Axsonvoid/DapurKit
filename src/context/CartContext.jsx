import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [plan, setPlan] = useState(null);
  const [userPreferences, setUserPreferences] = useState(null);

  useEffect(() => {
    const savedPlan = localStorage.getItem('dapurkit_plan');
    const savedPrefs = localStorage.getItem('dapurkit_preferences');
    if (savedPlan) setPlan(JSON.parse(savedPlan));
    if (savedPrefs) setUserPreferences(JSON.parse(savedPrefs));
  }, []);

  const addToBox = (recipe) => {
    if (!plan) return;
    if (cart.length >= plan.mealsPerWeek) {
      alert(`Kamu hanya bisa menambahkan maksimal ${plan.mealsPerWeek} resep per minggu.`);
      return;
    }
    setCart((prev) => [...prev, { ...recipe, id: recipe.id + Date.now() }]);
  };

  const removeFromBox = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Total price = number of recipes × price per serving × servings per recipe
  const totalPrice = plan 
    ? cart.length * plan.pricePerServing * plan.servings 
    : 0;

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        plan,
        userPreferences,
        setPlan,
        setUserPreferences,
        addToBox,
        removeFromBox,
        totalPrice,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};