'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ResumeEditor from '@/app/resume/ResumeEditor';

export default function ResumeEditPage() {
  const params = useParams();
  const router = useRouter();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchResume = async () => {
      try {
        const res = await fetch(`/api/resume/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          router.push('/login');
          return;
        }

        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Unable to load resume.');
          return;
        }

        setResumeData(data.resume || data);
      } catch (err) {
        console.error(err);
        setError('Unable to load resume.');
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [params.id, router]);

  if (loading) return (
    <div className='page-container flex min-h-screen items-center justify-center px-4'>
      <p className="text-gray-700">Loading resume...</p>
    </div>
  );
  if (error) return (
    <div className='page-container flex min-h-screen items-center justify-center px-4'>
      <p className='text-center text-red-600'>{error}</p>
    </div>
  );
  if (!resumeData) return <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-indigo-100 px-4">Resume not found.</div>;

  return <ResumeEditor resumeId={params.id} initialData={resumeData} />;
}
