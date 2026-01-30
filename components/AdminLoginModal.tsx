import React, { useState } from 'react';
import { auth } from '../firebase.ts';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

interface AdminLoginModalProps {
  onClose: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (err) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-fade-in">
        <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
          <i className="fas fa-lock text-green-700"></i> Admin Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border rounded-xl focus:border-green-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border rounded-xl focus:border-green-500 outline-none" 
            />
          </div>
          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
          <div className="flex gap-3 pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-green-700 transition-colors"
            >
              {loading ? 'AUTHENTICATING...' : 'LOGIN'}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-4 bg-gray-100 text-gray-400 font-black rounded-2xl">CANCEL</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;