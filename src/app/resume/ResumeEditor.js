'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { pdf } from '@react-pdf/renderer';
import Navbar from '../component/Navbar';
import ResumePDF from '../component/ResumePDF';
import ResumeTemplateClassic from '../component/ResumeTemplateClassic';
import './resume.css'

const blankResume = {
  title: '',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
  },
  education: [
    {
      school: '',
      degree: '',
      startDate: '',
      endDate: '',
      description: '',
    },
  ],
  experience: [
    {
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
    },
  ],
  skills: '',
};

function formatDate(value) {
  if (!value) return '';
  return value;
}

function getSkillList(skillsInput) {
  return skillsInput
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);
}

export default function ResumeEditor({ resumeId, initialData }) {
  const [formData, setFormData] = useState(blankResume);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const previewFrameRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        personalInfo: {
          fullName: initialData.personalInfo?.fullName || '',
          email: initialData.personalInfo?.email || '',
          phone: initialData.personalInfo?.phone || '',
          address: initialData.personalInfo?.address || '',
        },
        education: initialData.education?.length
          ? initialData.education
          : blankResume.education,
        experience: initialData.experience?.length
          ? initialData.experience
          : blankResume.experience,
        skills: Array.isArray(initialData.skills) ? initialData.skills.join(', ') : initialData.skills || '',
      });
    }
  }, [initialData]);

  const setPersonalInfo = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const setEducationItem = (index, field, value) => {
    setFormData((prev) => {
      const education = [...prev.education];
      education[index] = { ...education[index], [field]: value };
      return { ...prev, education };
    });
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { school: '', degree: '', startDate: '', endDate: '', description: '' },
      ],
    }));
  };

  const removeEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, idx) => idx !== index),
    }));
  };

  const setExperienceItem = (index, field, value) => {
    setFormData((prev) => {
      const experience = [...prev.experience];
      experience[index] = { ...experience[index], [field]: value };
      return { ...prev, experience };
    });
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: '', role: '', startDate: '', endDate: '', description: '' },
      ],
    }));
  };

  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, idx) => idx !== index),
    }));
  };

  const handleSave = async () => {
    setMessage('');
    setSaving(true);

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const payload = {
      ...formData,
      skills: getSkillList(formData.skills),
    };

    try {
      const res = await fetch(resumeId ? `/api/resume/${resumeId}` : '/api/resume', {
        method: resumeId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        const nextId = resumeId || data.resume?._id;
        setMessage('Resume saved successfully.');
        router.push('/resume');
      } else {
        setMessage(data.message || 'Unable to save resume.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Unable to save resume.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const blob = await pdf(<ResumePDF formData={formData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${formData.title?.trim().replace(/[^a-zA-Z0-9-_ ]/g, '') || 'resume'}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF download failed', error);
      setMessage('Unable to download resume PDF.');
    }
  };

  const skillList = getSkillList(formData.skills);

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

  return (
    <div className="page-container px-4 pb-10 sm:px-6">
      <Navbar/>
      <div className="mx-auto max-w-3xl px-2 pb-6 pt-20 text-center sm:pt-24">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{resumeId ? 'Edit Resume' : 'Create Resume'}</h1>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">Use the form to update your resume and review the live preview alongside it on larger screens.</p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <div className='card'>
          <h2 className='mb-6'>Resume Fields</h2>

          <div className='form-group'>
            <label className='form-label'>Resume name</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Resume title"
              className='form-input'
            />
          </div>

          <section className='mt-8'>
            <h3 className='mb-4'>Personal Information</h3>
            <div className='form-group'>
              <label className='form-label'>Full name</label>
              <input
                type="text"
                value={formData.personalInfo.fullName}
                onChange={(e) => setPersonalInfo('fullName', e.target.value)}
                className='form-input'
              />
            </div>
            <div className='form-group'>
              <label className='form-label'>Email</label>
              <input
                type="email"
                value={formData.personalInfo.email}
                onChange={(e) => setPersonalInfo('email', e.target.value)}
                className='form-input'
              />
            </div>
            <label className="mb-3 block">
              <span className="mb-2 block font-medium text-gray-800">Phone</span>
              <input
                type="number"
                value={formData.personalInfo.phone}
                onChange={(e) => setPersonalInfo('phone', e.target.value)}
                className='inp'
              />
            </label>
            <label className="mb-3 block">
              <span className="mb-2 block font-medium text-gray-800">Address</span>
              <input
                type="text"
                value={formData.personalInfo.address}
                onChange={(e) => setPersonalInfo('address', e.target.value)}
                className='inp'
              />
            </label>
          </section>

          <section className="mt-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Education</h3>
            {formData.education.map((item, index) => (
              <div key={index} className="mb-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
                <label className="mb-3 block">
                  <span className="mb-2 block font-medium text-gray-800">School</span>
                  <input
                    type="text"
                    value={item.school}
                    onChange={(e) => setEducationItem(index, 'school', e.target.value)}
                    className='inp'
                  />
                </label>
                <label className="mb-3 block">
                  <span className="mb-2 block font-medium text-gray-800">Degree</span>
                  <input
                    type="text"
                    value={item.degree}
                    onChange={(e) => setEducationItem(index, 'degree', e.target.value)}
                    className='inp'
                  />
                </label>
                <div className="mb-3 flex flex-col gap-3 sm:flex-row">
                  <label className="flex-1">
                    <span className="mb-2 block font-medium text-gray-800">Start date</span>
                    <input
                      type="date"
                      value={item.startDate}
                      onChange={(e) => setEducationItem(index, 'startDate', e.target.value)}
                      placeholder="e.g. 2020"
                      className='inp'
                    />
                  </label>
                  <label className="flex-1">
                    <span className="mb-2 block font-medium text-gray-800">End date</span>
                    <input
                      type="date"
                      value={item.endDate}
                      onChange={(e) => setEducationItem(index, 'endDate', e.target.value)}
                      placeholder="e.g. 2024"
                      className='inp'
                    />
                  </label>
                </div>
                <label className="mb-3 block">
                  <span className="mb-2 block font-medium text-gray-800">Description</span>
                  <textarea
                    value={item.description}
                    onChange={(e) => setEducationItem(index, 'description', e.target.value)}
                    rows={3}
                    className='inp'
                  />
                </label>
                {formData.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                  >
                    Remove education
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addEducation}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Add education
            </button>
          </section>

          <section className="mt-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Experience</h3>
            {formData.experience.map((item, index) => (
              <div key={index} className="mb-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
                <label className="mb-3 block">
                  <span className="mb-2 block font-medium text-gray-800">Company</span>
                  <input
                    type="text"
                    value={item.company}
                    onChange={(e) => setExperienceItem(index, 'company', e.target.value)}
                    className='inp'
                  />
                </label>
                <label className="mb-3 block">
                  <span className="mb-2 block font-medium text-gray-800">Role</span>
                  <input
                    type="text"
                    value={item.role}
                    onChange={(e) => setExperienceItem(index, 'role', e.target.value)}
                    className='inp'
                  />
                </label>
                <div className="mb-3 flex flex-col gap-3 sm:flex-row">
                  <label className="flex-1">
                    <span className="mb-2 block font-medium text-gray-800">Start date</span>
                    <input
                      type="date"
                      value={item.startDate}
                      onChange={(e) => setExperienceItem(index, 'startDate', e.target.value)}
                      placeholder="e.g. 2021"
                      className='inp'
                    />
                  </label>
                  <label className="flex-1">
                    <span className="mb-2 block font-medium text-gray-800">End date</span>
                    <input
                      type="date"
                      value={item.endDate}
                      onChange={(e) => setExperienceItem(index, 'endDate', e.target.value)}
                      placeholder="e.g. 2024"
                      className='inp'
                    />
                  </label>
                </div>
                <label className="mb-3 block">
                  <span className="mb-2 block font-medium text-gray-800">Description</span>
                  <textarea
                    value={item.description}
                    onChange={(e) => setExperienceItem(index, 'description', e.target.value)}
                    rows={3}
                    className='inp'
                  />
                </label>
                {formData.experience.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                  >
                    Remove experience
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addExperience}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Add experience
            </button>
          </section>

          <section className="mt-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Skills</h3>
            <label className="block">
              <span className="mb-2 block font-medium text-gray-800">List skills separated by commas</span>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData((prev) => ({ ...prev, skills: e.target.value }))}
                placeholder="e.g. JavaScript, React, Node.js"
                className='inp'
              />
            </label>
          </section>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Resume'}
            </button>
            {message && <span className="text-sm text-gray-700">{message}</span>}
          </div>
        </div>

        <div className='resume-preview-card p-5 sm:p-8 lg:p-10'>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
            <button type='button' onClick={handleDownloadPdf} className='btn-download w-full sm:w-auto'>Download PDF</button>
          </div>

          <div ref={previewFrameRef} className="w-full overflow-hidden">
            <div style={{ height: `${1123 * previewScale}px` }}>
              <div
                style={{
                  width: '794px',
                  height: '1123px',
                  transform: `scale(${previewScale})`,
                  transformOrigin: 'top left',
                }}
              >
                <ResumeTemplateClassic data={formData} />
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}
