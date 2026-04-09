'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { pdf } from '@react-pdf/renderer';
import Navbar from '../component/Navbar';
import ResumePDF from '../component/ResumePDF';
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

  return (
    <div className='page-container'>
      <Navbar/>
      <div className='resume-editor-heading'>
        <div className='heading'>
          <h1>{resumeId ? 'Edit Resume' : 'Create Resume'}</h1>
          <p>Use the left form to update your resume and watch the preview on the right.</p>
        </div>
        {/* <button
          onClick={() => router.push('/resume')}
          className='back-btn'
        >
          Back to Resumes
        </button> */}
      </div>

      <div className='resume-editor-container'>
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
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Phone
              <input
                type="text"
                value={formData.personalInfo.phone}
                onChange={(e) => setPersonalInfo('phone', e.target.value)}
                className='inp'
              />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Address
              <input
                type="text"
                value={formData.personalInfo.address}
                onChange={(e) => setPersonalInfo('address', e.target.value)}
                className='inp'
              />
            </label>
          </section>

          <section style={{ marginTop: '20px' }}>
            <h3>Education</h3>
            {formData.education.map((item, index) => (
              <div key={index} style={{ marginBottom: '16px', border: '1px solid #eee', padding: '12px', borderRadius: '8px' }}>
                <label style={{ display: 'block', marginBottom: '10px' }}>
                  School
                  <input
                    type="text"
                    value={item.school}
                    onChange={(e) => setEducationItem(index, 'school', e.target.value)}
                    className='inp'
                  />
                </label>
                <label style={{ display: 'block', marginBottom: '10px' }}>
                  Degree
                  <input
                    type="text"
                    value={item.degree}
                    onChange={(e) => setEducationItem(index, 'degree', e.target.value)}
                    className='inp'
                  />
                </label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <label style={{ flex: 1 }}>
                    Start date
                    <input
                      type="date"
                      value={item.startDate}
                      onChange={(e) => setEducationItem(index, 'startDate', e.target.value)}
                      placeholder="e.g. 2020"
                      className='inp'
                    />
                  </label>
                  <label style={{ flex: 1 }}>
                    End date
                    <input
                      type="date"
                      value={item.endDate}
                      onChange={(e) => setEducationItem(index, 'endDate', e.target.value)}
                      placeholder="e.g. 2024"
                      className='inp'
                    />
                  </label>
                </div>
                <label style={{ display: 'block', marginBottom: '10px' }}>
                  Description
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
                    style={{ padding: '8px 12px', backgroundColor: '#ff4d4f', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Remove education
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addEducation}
              style={{ padding: '10px 14px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              Add education
            </button>
          </section>

          <section style={{ marginTop: '20px' }}>
            <h3>Experience</h3>
            {formData.experience.map((item, index) => (
              <div key={index} style={{ marginBottom: '16px', border: '1px solid #eee', padding: '12px', borderRadius: '8px' }}>
                <label style={{ display: 'block', marginBottom: '10px' }}>
                  Company
                  <input
                    type="text"
                    value={item.company}
                    onChange={(e) => setExperienceItem(index, 'company', e.target.value)}
                    className='inp'
                  />
                </label>
                <label style={{ display: 'block', marginBottom: '10px' }}>
                  Role
                  <input
                    type="text"
                    value={item.role}
                    onChange={(e) => setExperienceItem(index, 'role', e.target.value)}
                    className='inp'
                  />
                </label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <label style={{ flex: 1 }}>
                    Start date
                    <input
                      type="date"
                      value={item.startDate}
                      onChange={(e) => setExperienceItem(index, 'startDate', e.target.value)}
                      placeholder="e.g. 2021"
                      className='inp'
                    />
                  </label>
                  <label style={{ flex: 1 }}>
                    End date
                    <input
                      type="date"
                      value={item.endDate}
                      onChange={(e) => setExperienceItem(index, 'endDate', e.target.value)}
                      placeholder="e.g. 2024"
                      className='inp'
                    />
                  </label>
                </div>
                <label style={{ display: 'block', marginBottom: '10px' }}>
                  Description
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
                    style={{ padding: '8px 12px', backgroundColor: '#ff4d4f', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Remove experience
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addExperience}
              style={{ padding: '10px 14px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              Add experience
            </button>
          </section>

          <section style={{ marginTop: '20px' }}>
            <h3>Skills</h3>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              List skills separated by commas
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData((prev) => ({ ...prev, skills: e.target.value }))}
                placeholder="e.g. JavaScript, React, Node.js"
                className='inp'
              />
            </label>
          </section>

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{ padding: '12px 18px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              {saving ? 'Saving...' : 'Save Resume'}
            </button>
            {message && <span style={{ color: '#333' }}>{message}</span>}
          </div>
        </div>

        <div className='resume-preview-card'>
          <div className='preview-heading-row'>
            <h2>Preview</h2>
            <button type='button' onClick={handleDownloadPdf} className='btn btn-primary'>Download PDF</button>
          </div>

          {/* PDF-like Header */}
          <div className='preview-header'>
            <h1 className='preview-name'>{formData.personalInfo.fullName || 'Full Name'}</h1>
            <p className='preview-contact'>
              {formData.personalInfo.email || 'email@example.com'} • {formData.personalInfo.phone || '(555) 555-5555'}
            </p>
            <p className='preview-contact'>
              {formData.personalInfo.address || 'Your address here'}
            </p>
          </div>

          {/* Two Column Layout */}
          <div className='preview-two-column'>
            {/* Left Column: Personal Information and Skills */}
            <div className='preview-left-column'>
              {/* Personal Information Section */}
              <div className='preview-section'>
                <h3 className='preview-section-title'>Personal Information</h3>
                <div className='preview-personal-info-item'>
                  <strong>Name: </strong>
                  {formData.personalInfo.fullName || 'Not provided'}
                </div>
                <div className='preview-personal-info-item'>
                  <strong>Email: </strong>
                  {formData.personalInfo.email || 'Not provided'}
                </div>
                <div className='preview-personal-info-item'>
                  <strong>Phone: </strong>
                  {formData.personalInfo.phone || 'Not provided'}
                </div>
                <div className='preview-personal-info-item'>
                  <strong>Address: </strong>
                  {formData.personalInfo.address || 'Not provided'}
                </div>
              </div>

              {/* Skills Section */}
              {skillList.length > 0 && (
                <div className='preview-section'>
                  <h3 className='preview-section-title'>Skills</h3>
                  <p className='preview-skills-text'>{skillList.join(', ')}</p>
                </div>
              )}
            </div>

            {/* Right Column: Education and Experience */}
            <div className='preview-right-column'>
              {/* Education Section */}
              {formData.education && formData.education.length > 0 && (
                <div className='preview-section'>
                  <h3 className='preview-section-title'>Education</h3>
                  {formData.education.map((item, index) => (
                    <div key={index} className='preview-item'>
                      <div className='preview-item-title'>{item.degree || 'Degree'}</div>
                      <div className='preview-item-subtitle'>{item.school || 'School'}</div>
                      {(item.startDate || item.endDate) && (
                        <div className='preview-date-range'>
                          {item.startDate || 'Start'} - {item.endDate || 'End'}
                        </div>
                      )}
                      {item.description && (
                        <p className='preview-description'>{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Experience Section */}
              {formData.experience && formData.experience.length > 0 && (
                <div className='preview-section'>
                  <h3 className='preview-section-title'>Work Experience</h3>
                  {formData.experience.map((item, index) => (
                    <div key={index} className='preview-item'>
                      <div className='preview-item-title'>{item.role || 'Role'}</div>
                      <div className='preview-item-subtitle'>{item.company || 'Company'}</div>
                      {(item.startDate || item.endDate) && (
                        <div className='preview-date-range'>
                          {item.startDate || 'Start'} - {item.endDate || 'Present'}
                        </div>
                      )}
                      {item.description && (
                        <p className='preview-description'>{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}
