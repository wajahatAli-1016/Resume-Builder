'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './dashboard.css'
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

  

  if (!user) return <div>Loading...</div>;

  return (
    <div className='dashboard-container'>
      <Navbar/>
      <div className='headings'>
      <h1>Welcome to your Dashboard, {user.name}!</h1>
      <h3>Manage your Resumes</h3>
      </div>
      <div className='btn-container'>
        <div>
        <div className='btn-box' >
          <button
            onClick={() => router.push('/resume/new')}
            className='btn'
          >
           <IoAddCircleSharp style={{ fontSize: '50px' }} />
          </button>
          
        </div>
        <p className='btn-text'>Create New Resume</p>
        </div>
        <div>
        <div className='btn-box' >
          <button
            onClick={() => router.push('/resume')}
            className='btn'
          >
          <FaSave style={{ fontSize: '50px' }}/>
          </button>
        </div>
          <p className='btn-text'>View Saved Resumes</p>

        </div>
      </div>


    </div>
  );
}