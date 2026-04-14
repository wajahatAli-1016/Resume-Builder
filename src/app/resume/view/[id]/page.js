'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/app/component/Navbar';
import ResumeTemplateClassic from '@/app/component/ResumeTemplateClassic';
import '../../resume.css';

export default function ResumeViewPage() {
  const params = useParams();
  const router = useRouter();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const previewFrameRef = useRef(null);

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

  useEffect(() => {
    const node = previewFrameRef.current;
    if (!node) return;

    const BASE_WIDTH = 794;
    const updateScale = () => {
      const width = node.clientWidth || BASE_WIDTH;
      const nextScale = Math.min(1, width / BASE_WIDTH);
      setPreviewScale(nextScale);
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(node);
    window.addEventListener('resize', updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  const handleDelete = async () => {
    if (!resumeData?._id || deleting) return;
    if (!confirm('Are you sure you want to delete this resume?')) return;

    const token = localStorage.getItem('token');
    setDeleting(true);
    setError('');

    try {
      const res = await fetch(`/api/resume/${resumeData._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Unable to delete resume.');
        return;
      }

      router.push('/resume');
    } catch (err) {
      console.error(err);
      setError('Unable to delete resume.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-indigo-100 pb-12 pt-20 sm:pt-24">
        <Navbar />
        <p className="text-center text-gray-700">Loading resume...</p>
      </div>
    );
  }

  if (error && !resumeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-indigo-100 pb-12 pt-20 sm:pt-24">
        <Navbar />
        <p className="text-center text-red-600">{error}</p>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-indigo-100 pb-12 pt-20 sm:pt-24">
        <Navbar />
        <p className="text-center text-gray-700">Resume not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-100 pb-12 pt-20 sm:pt-24">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-5 text-center">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{resumeData.title || 'Untitled Resume'}</h1>
        </div>

        <div className="resume-preview-card p-4 sm:p-6 ml-6">
  <div 
    ref={previewFrameRef} 
    className="w-full overflow-hidden flex justify-center items-center"
  >
    <div style={{ height: `${1123 * previewScale}px` }}>
      <div
        style={{
          width: '794px',
          height: '1123px',
          transform: `scale(${previewScale})`,
          transformOrigin: 'top center', // Changed from 'top left'
        }}
      >
        <ResumeTemplateClassic data={resumeData} />
      </div>
    </div>
  </div>
</div>

        {error ? <p className="mt-4 text-center text-red-600">{error}</p> : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => router.push(`/resume/${resumeData._id}`)}
            className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Edit Resume
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg bg-red-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? 'Deleting...' : 'Delete Resume'}
          </button>
        </div>
      </div>
    </div>
  );
}
