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
  
            <button
              type="button"
              onClick={() => router.push(`/resume/view/${resume._id}`)}
              className="relative block w-full bg-gray-50 text-left"
              aria-label={`Open ${resume.title || 'resume'} preview`}
            >
              <div className="relative w-full overflow-hidden" style={{ paddingBottom: '75%' }}>
                <div className="absolute inset-0 flex items-start justify-center overflow-hidden">
                  <div className={`
                    origin-top
                    mt-2
                    scale-[0.42] sm:scale-[0.38] md:scale-[0.35] lg:scale-[0.32]
                    transform-gpu
                  `}>
                    <ResumeThumbnail resume={resume} />
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent z-10" />
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
  );
}
