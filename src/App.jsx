import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Survey from './pages/Survey';
import PlanSelection from './pages/PlanSelection';
import BrowseRecipes from './pages/BrowseRecipes';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Addresses from './pages/Addresses';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Payment from './pages/Payment';

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Landing />} />
              <Route path="survey" element={<Survey />} />
              <Route path="plan" element={<PlanSelection />} />
              <Route path="recipes" element={<BrowseRecipes />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="success" element={<Success />} />
              <Route path="login" element={<Login />} />
              {/* Dashboard routes (protected – requires login) */}
              <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
              <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </UserProvider>
  );
}

export default App;