import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, updateProfile, logout } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });

  const [errors, setErrors] = useState({});

    const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Nama harus diisi';
    if (!form.email.trim()) newErrors.email = 'Email harus diisi';
    if (!form.email.includes('@')) newErrors.email = 'Email tidak valid';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    updateProfile(form);
    alert('Profil berhasil diperbarui');
    };


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Profil Saya</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
            <input className="w-full border rounded-lg p-2" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full border rounded-lg p-2" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nomor Telepon</label>
            <input className="w-full border rounded-lg p-2" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          </div>
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">Simpan Perubahan</button>
        </form>
        <hr className="my-6" />
        <button onClick={handleLogout} className="text-red-600 border border-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition">Keluar</button>
      </div>
    </div>
  );
}