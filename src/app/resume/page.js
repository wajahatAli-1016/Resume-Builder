'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../component/Navbar';
import './resume.css'

export default function ResumeListPage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchResumes = async () => {
      try {
        const res = await fetch('/api/resume', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          router.push('/login');
          return;
        }

        const data = await res.json();
        setResumes(data || []);
      } catch (err) {
        console.error(err);
        setError('Unable to load resumes.');
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [router]);

  const handleDeleteResume = (id) => async () => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/resume', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id }),
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (res.status === 404) {
        setError('Resume not found.');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to delete resume.');
      }

      // Remove the deleted resume from the state
      setResumes(resumes.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      setError('Unable to delete resume.');
    }
  };


  return (
    <div className='main-container'>
      <Navbar />
      <div className='resume-container'>
        <div className='headings'>
          <h1>Your Resumes</h1>
          <h3>Manage your created resumes and open an existing resume for editing.</h3>
        </div>
      </div>
        

      {loading ? (
        <p className='text-center'>Loading resumes...</p>
      ) : error ? (
        <p className='text-center text-red-600'>{error}</p>
      ) : resumes.length === 0 ? (
        <div className='empty-state'>
          <p>You haven&apos;t created any resumes yet.</p>
          <button
            onClick={() => router.push('/resume/new')}
          >
            Create your first resume
          </button>
        </div>
      ) : (
        <div className='resume-boxes-container'>
          {resumes.map((resume) => (
            <div key={resume._id} className='resume-box'>
              <div className='resume-detail-box'>
                <div>
                  <h2>Title: <span className='font-semibold'>{resume.title || 'Untitled Resume'}</span></h2>
                  <p>
                    Updated: {new Date(resume.updatedAt || resume.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className='resume-action-buttons'>
                  <button
                    onClick={() => router.push(`/resume/${resume._id}`)}
                    className='edit-btn'
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteResume(resume._id)}
                    className='delete-btn'
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            
          ))}
        </div>
      


      )}

    </div>

  );
}
