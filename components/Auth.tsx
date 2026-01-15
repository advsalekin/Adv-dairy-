
import React, { useState } from 'react';
import { Icons } from '../constants';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call Firebase. Here we use storageService simulated logic.
    const mockUser: User = {
      userId: Math.random().toString(36).substr(2, 9),
      name: name || email.split('@')[0],
      email: email
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-amber-500 text-slate-900 rounded-3xl mb-4 shadow-lg">
            <Icons.Gavel />
          </div>
          <h1 className="text-4xl font-serif text-slate-900 mb-2">Adv Dairy</h1>
          <p className="text-slate-700 font-medium">The modern advocate's digital workload assistant.</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest px-1">Full Name</label>
                <input 
                  required
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Advocate Name"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest px-1">Email Address</label>
              <input 
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="advocate@bar.com"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest px-1">Password</label>
              <input 
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg mt-4 active:scale-[0.98]"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <p className="text-slate-700 font-medium">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-bold text-amber-700 hover:text-amber-800 decoration-2 underline-offset-4 hover:underline"
              >
                {isLogin ? 'Register Now' : 'Sign In Instead'}
              </button>
            </p>
          </div>
        </div>

        <p className="mt-12 text-center text-xs text-slate-600 font-bold uppercase tracking-widest">
          Professional Legal Management Software • v1.0.0
        </p>
      </div>
    </div>
  );
};

export default Auth;
