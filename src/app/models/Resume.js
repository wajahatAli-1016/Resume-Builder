import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
  },
  education: [
    {
      school: String,
      degree: String,
      startDate: String,
      endDate: String,
      description: String,
    },
  ],
  experience: [
    {
      company: String,
      role: String,
      startDate: String,
      endDate: String,
      description: String,
    },
  ],
  skills: [String],
}, { timestamps: true });

const Resume = mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
export default Resume;