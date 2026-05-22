import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login, register } = useUser(); // we'll add register in UserContext
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (isLogin) {
      const success = login(email, password);
      if (success) navigate('/dashboard');
      else setError('Email/password salah (demo: email apa saja, password apa saja)');
    } else {
      register(name, email, password);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-primary text-center mb-6">{isLogin ? 'Masuk' : 'Daftar Akun'}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && <input type="text" placeholder="Nama Lengkap" className="w-full border rounded-lg p-3" value={name} onChange={e => setName(e.target.value)} required />}
          <input type="email" placeholder="Email" className="w-full border rounded-lg p-3" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full border rounded-lg p-3" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-secondary text-white py-3 rounded-full font-semibold">{isLogin ? 'Masuk' : 'Daftar'}</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">{isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'} <button onClick={() => setIsLogin(!isLogin)} className="text-primary underline">{isLogin ? 'Daftar' : 'Masuk'}</button></p>
      </div>
    </div>
  );
}