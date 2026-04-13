'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-indigo-100 px-4 py-10 sm:px-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900 sm:text-3xl">Resume Builder</h1>
        <h2 className="mb-6 text-center text-xl font-semibold text-gray-800 sm:text-2xl">Login</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='form-group'>
            <label className='form-label'>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='form-input'
            />
          </div>
          <div className='form-group'>
            <label className='form-label'>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='form-input'
            />
          </div>
          {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
          <button type="submit" className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-700">
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600 sm:text-base">
          Dont have an account?{" "}
          <a href="/signup" className="font-medium text-indigo-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}