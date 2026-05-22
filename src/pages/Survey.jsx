import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

export default function Survey() {
  const navigate = useNavigate();
  const { setUserPreferences, setPlan } = useCart();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    taste: [],
    servings: 1,
    mealsPerDay: 2,
    allergens: [],
  });

  const tasteOptions = [
    { id: 'balanced', label: 'Seimbang', emoji: '⚖️', desc: 'Protein, sayur & karbohidrat' },
    { id: 'veggie', label: 'Vegetarian', emoji: '🥬', desc: 'Hanya nabati, lezat & sehat' },
    { id: 'lowcarb', label: 'Rendah Karbohidrat', emoji: '🥩', desc: 'Keto-friendly' },
    { id: 'quick', label: 'Cepat & Mudah', emoji: '⚡', desc: 'Kurang dari 20 menit' },
  ];

  const servingOptions = [1, 2, 4];
  const mealsPerDayOptions = [1, 2];

  const allergenOptions = [
    { id: 'no_allergy', label: 'Tidak ada alergi', emoji: '✅' },
    { id: 'nuts', label: 'Kacang-kacangan', emoji: '🥜' },
    { id: 'dairy', label: 'Susu & Olahan', emoji: '🥛' },
    { id: 'gluten', label: 'Gluten (gandum)', emoji: '🌾' },
    { id: 'shellfish', label: 'Kerang & Udang', emoji: '🦐' },
    { id: 'eggs', label: 'Telur', emoji: '🥚' },
    { id: 'soy', label: 'Kedelai', emoji: '🫘' },
  ];

  const handleTasteToggle = (tasteId) => {
    setFormData(prev => ({
      ...prev,
      taste: prev.taste.includes(tasteId)
        ? prev.taste.filter(t => t !== tasteId)
        : [...prev.taste, tasteId]
    }));
  };

  const handleAllergenToggle = (allergenId) => {
    if (allergenId === 'no_allergy') {
      // If "no allergy" is selected, clear all others
      setFormData(prev => ({ ...prev, allergens: ['no_allergy'] }));
      return;
    }
    setFormData(prev => {
      let newAllergens = prev.allergens.filter(a => a !== 'no_allergy');
      if (newAllergens.includes(allergenId)) {
        newAllergens = newAllergens.filter(a => a !== allergenId);
      } else {
        newAllergens = [...newAllergens, allergenId];
      }
      return { ...prev, allergens: newAllergens };
    });
  };

  const nextStep = () => {
    if (step === 3) { // last step (allergens)
      // Calculate price per serving per meal
      // Base: 1 person, 2 meals/day, 7 days = Rp 399,000 => price per meal per person = 399000 / 14 = 28,500
      const pricePerServingPerMeal = 28500;
      const mealsPerWeek = formData.mealsPerDay * 7;
      const totalWeekly = pricePerServingPerMeal * formData.servings * mealsPerWeek;

      const planData = {
        servings: formData.servings,
        mealsPerDay: formData.mealsPerDay,
        mealsPerWeek: mealsPerWeek,
        pricePerServing: pricePerServingPerMeal,
        totalWeekly: totalWeekly,
      };
      setPlan(planData);
      setUserPreferences(formData);
      localStorage.setItem('dapurkit_plan', JSON.stringify(planData));
      localStorage.setItem('dapurkit_preferences', JSON.stringify(formData));
      navigate('/plan');
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const isStepValid = () => {
    if (step === 0) return formData.taste.length > 0;
    if (step === 1) return formData.servings !== null;
    if (step === 2) return formData.mealsPerDay !== null;
    if (step === 3) return true; // allergens optional
    return true;
  };

  const steps = ['Selera', 'Jumlah Orang', 'Frekuensi Makan', 'Alergi'];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((s, i) => (
              <div key={s} className="text-center flex-1">
                <div className={`text-sm font-medium ${i <= step ? 'text-primary' : 'text-gray-400'}`}>
                  {s}
                </div>
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 0 && (
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">Pilihan Selera</h2>
              <p className="text-gray-600 mb-6">Pilih gaya masakan favoritmu (bisa lebih dari satu)</p>
              <div className="space-y-3">
                {tasteOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleTasteToggle(option.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      formData.taste.includes(option.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.emoji}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{option.label}</div>
                        <div className="text-sm text-gray-500">{option.desc}</div>
                      </div>
                      {formData.taste.includes(option.id) && (
                        <Check className="text-primary" size={20} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">Jumlah Orang</h2>
              <p className="text-gray-600 mb-6">Untuk berapa orang setiap masakan?</p>
              <div className="grid grid-cols-3 gap-4">
                {servingOptions.map(size => (
                  <button
                    key={size}
                    onClick={() => setFormData({ ...formData, servings: size })}
                    className={`p-6 rounded-xl border-2 text-center transition-all ${
                      formData.servings === size
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-secondary'
                    }`}
                  >
                    <div className="text-3xl mb-2">👥</div>
                    <div className="text-xl font-semibold">{size} {size === 1 ? 'orang' : 'orang'}</div>
                    <div className="text-sm text-gray-500">
                      {size === 1 ? 'Ideal untuk sendiri' : size === 2 ? 'Pasangan / kecil' : 'Keluarga'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">Makan per Hari</h2>
              <p className="text-gray-600 mb-6">Berapa banyak menu yang ingin kamu terima setiap hari?</p>
              <div className="grid grid-cols-2 gap-4">
                {mealsPerDayOptions.map(num => {
                  const mealsPerWeek = num * 7;
                  const examplePrice = 28500 * 1 * mealsPerWeek; // for 1 person
                  return (
                    <button
                      key={num}
                      onClick={() => setFormData({ ...formData, mealsPerDay: num })}
                      className={`p-6 rounded-xl border-2 text-center transition-all ${
                        formData.mealsPerDay === num
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-secondary'
                      }`}
                    >
                      <div className="text-3xl mb-2">{num === 1 ? '🍽️' : '🍽️🍽️'}</div>
                      <div className="text-xl font-bold text-primary mb-1">{num} menu/hari</div>
                      <div className="text-sm text-gray-600 mb-2">({mealsPerWeek} menu/minggu)</div>
                      <div className="text-xs text-gray-500">mulai Rp {examplePrice.toLocaleString('id-ID')}/minggu*</div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 p-4 bg-secondary/10 rounded-lg">
                <p className="text-sm text-gray-700 text-center">
                  💡 Contoh: 2 menu/hari = 14 resep/minggu. Mulai Rp 399.000/minggu untuk 1 orang.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">Alergi & Pantangan</h2>
              <p className="text-gray-600 mb-6">Kami akan sesuaikan resep dengan alergimu (opsional)</p>
              <div className="grid grid-cols-2 gap-3">
                {allergenOptions.map(allergen => (
                  <button
                    key={allergen.id}
                    onClick={() => handleAllergenToggle(allergen.id)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      formData.allergens.includes(allergen.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-secondary'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xl">{allergen.emoji}</span>
                      <span className="text-sm font-medium">{allergen.label}</span>
                      {formData.allergens.includes(allergen.id) && (
                        <Check className="text-primary" size={16} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4 text-center">
                Pilih "Tidak ada alergi" jika tidak memiliki pantangan. Bisa pilih lebih dari satu.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 0 && (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                <ArrowLeft size={18} /> Kembali
              </button>
            )}
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition ml-auto ${
                isStepValid()
                  ? 'bg-primary text-white hover:bg-green-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {step === 3 ? 'Lihat Paket' : 'Selanjutnya'} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}