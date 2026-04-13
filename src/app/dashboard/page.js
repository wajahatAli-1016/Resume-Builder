'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoAddCircleSharp } from "react-icons/io5";
import { FaSave } from "react-icons/fa";
import Navbar from '../component/Navbar';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ name: payload.name || 'User' });
    } catch {
      setUser({ name: 'User' });
    }
  }, [router]);
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-indigo-100 text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-100 pb-12 pt-20 sm:pt-24">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">Welcome to your Dashboard, {user.name}!</h1>
      <h3 className="mb-8 text-base text-gray-600 sm:mb-10 sm:text-lg">Manage your Resumes</h3>
      </div>
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:gap-8 sm:px-6">
        <div className="flex flex-col items-center">
        <div className="w-full max-w-xs rounded-xl border border-gray-200 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg sm:p-8">
          <button
            type="button"
            onClick={() => router.push('/resume/new')}
            className="flex w-full items-center justify-center rounded-full p-4 transition hover:bg-gray-50"
          >
           <IoAddCircleSharp className="text-5xl text-indigo-600 sm:text-6xl" />
          </button>
        </div>
        <p className="mt-4 text-center text-base font-semibold text-gray-800 sm:text-lg">Create New Resume</p>
        </div>
        <div className="flex flex-col items-center">
        <div className="w-full max-w-xs rounded-xl border border-gray-200 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg sm:p-8">
          <button
            type="button"
            onClick={() => router.push('/resume')}
            className="flex w-full items-center justify-center rounded-full p-4 transition hover:bg-gray-50"
          >
          <FaSave className="text-5xl text-indigo-600 sm:text-6xl" />
          </button>
        </div>
          <p className="mt-4 text-center text-base font-semibold text-gray-800 sm:text-lg">View Saved Resumes</p>
        </div>
      </div>
    </div>
  );
}