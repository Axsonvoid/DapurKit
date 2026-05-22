import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('dapurkit_user');
    const savedOrders = localStorage.getItem('dapurkit_orders');
    const savedAddresses = localStorage.getItem('dapurkit_addresses');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedAddresses) setAddresses(JSON.parse(savedAddresses));
  }, []);

  // Save to localStorage whenever they change
  useEffect(() => {
    if (user) localStorage.setItem('dapurkit_user', JSON.stringify(user));
  }, [user]);
  useEffect(() => {
    localStorage.setItem('dapurkit_orders', JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    localStorage.setItem('dapurkit_addresses', JSON.stringify(addresses));
  }, [addresses]);

  const login = (email, password) => {
    // Simulate login – in real app, call API
    const mockUser = { id: 1, name: 'Budi Santoso', email, phone: '08123456789' };
    setUser(mockUser);
    return true;
  };

  const register = (name, email, password) => {
    const newUser = { id: Date.now(), name, email, phone: '' };
    setUser(newUser);
    localStorage.setItem('dapurkit_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dapurkit_user');
  };

  const updateProfile = (data) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  const addOrder = (order) => {
    setOrders(prev => [order, ...prev]);
  };

  const addAddress = (address) => {
    setAddresses(prev => [...prev, { id: Date.now(), ...address }]);
  };

  const removeAddress = (id) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  return (
    <UserContext.Provider value={{
      user,
      orders,
      addresses,
      login,
      logout,
      updateProfile,
      addOrder,
      addAddress,
      removeAddress,
    }}>
      {children}
    </UserContext.Provider>
  );
};