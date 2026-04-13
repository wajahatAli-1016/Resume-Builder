'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../component/Navbar';
import ResumeThumbnail from '../component/ResumeThumbnail';
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
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-100 pb-12 pt-20 sm:pt-24">
    <Navbar />
    <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
      <div className="mb-8 sm:mb-10">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">Your Resumes</h1>
        <h3 className="text-base text-gray-600 sm:text-lg">Manage your created resumes and open an existing resume for editing.</h3>
      </div>
    </div>
  
    {loading ? (
      <p className="text-center text-gray-700">Loading resumes...</p>
    ) : error ? (
      <p className="text-center text-red-600">{error}</p>
    ) : resumes.length === 0 ? (
      <div className="mx-auto max-w-lg rounded-2xl border-2 border-dashed border-gray-300 bg-white px-6 py-10 text-center shadow-sm">
        <p className="mb-6 text-base text-gray-600 sm:text-lg">You haven&apos;t created any resumes yet.</p>
        <button
          type="button"
          onClick={() => router.push('/resume/new')}
          className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Create your first resume
        </button>
      </div>
    ) : (
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:px-6">
        {resumes.map((resume) => (
          <div
            key={resume._id}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                  {resume.title || 'Untitled Resume'}
                </h2>
                <p className="mt-0.5 text-xs text-gray-600 sm:text-sm">
                  Updated: {new Date(resume.updatedAt || resume.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
  
            {/* Thumbnail viewport - CORRECTED VERSION */}
            <div className="relative bg-gray-50">
              {/* Responsive container that maintains aspect ratio */}
              <div className="relative w-full overflow-hidden" style={{ paddingBottom: '75%' }}>
                <div className="absolute inset-0 flex items-start justify-center overflow-hidden">
                  <div className={`
                    origin-top
                    mt-2
                    /* Responsive scaling based on screen size */
                    scale-[0.42] sm:scale-[0.38] md:scale-[0.35] lg:scale-[0.32]
                    transform-gpu
                  `}>
                    <ResumeThumbnail resume={resume} />
                  </div>
                </div>
              </div>
  
              {/* Soft fade at bottom */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent z-10" />
  
              {/* Actions - Always visible and properly positioned */}
              <div className="absolute inset-x-0 bottom-0 flex gap-2 p-3 z-20">
                <button
                  type="button"
                  onClick={() => router.push(`/resume/${resume._id}`)}
                  className="flex-1 rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleDeleteResume(resume._id)}
                  className="flex-1 rounded-lg bg-red-500 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
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
