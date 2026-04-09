'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Account created successfully! Please log in.');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <h1 className='auth-heading'>Resume Builder</h1>
        <h2 className='auth-heading'>Sign Up</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='form-group'>
            <label className='form-label'>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className='form-input'
            />
          </div>
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
          {error && <p className='text-center text-red-600 mt-4'>{error}</p>}
          {success && <p className='text-center text-green-600 mt-4'>{success}</p>}
          <button type="submit" className='btn btn-primary w-full'>
            Sign Up
          </button>
        </form>
        <p className='auth-link'>
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
}