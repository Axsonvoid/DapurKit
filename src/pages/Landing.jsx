import { Link } from 'react-router-dom';
import { Utensils, Leaf, Truck } from 'lucide-react';

export default function Landing() {
  return (
    <div className="w-full">
      {/* Hero Section - Full width */}
      <section className="w-full py-32 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6">
            dapurkit
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            Chefs' recipes, farm-fresh ingredients — delivered weekly.
          </p>
          <Link
            to="/survey"
            className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-600 transition shadow-lg"
          >
            Get Started <Utensils size={20} />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <Leaf className="mx-auto text-primary mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2">Fresh Ingredients</h3>
            <p className="text-gray-600">Sourced daily from local farms.</p>
          </div>
          <div className="text-center">
            <Utensils className="mx-auto text-secondary mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2">Chef Recipes</h3>
            <p className="text-gray-600">15-min meals, restaurant taste.</p>
          </div>
          <div className="text-center">
            <Truck className="mx-auto text-primary mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2">Carbon-Neutral Delivery</h3>
            <p className="text-gray-600">Free shipping on all boxes.</p>
          </div>
        </div>
      </section>
    </div>
  );
}