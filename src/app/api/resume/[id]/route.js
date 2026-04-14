import { connectDB } from '@/app/lib/db';
import Resume from '@/app/models/Resume';
import { verifyToken } from '@/app/lib/auth';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
  const user = verifyToken(req);
  if (!user) return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  const {id } = await params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ message: 'Invalid resume ID' }), { status: 400 });
  }

  await connectDB();
  
  const resume = await Resume.findOne({ _id: id, userId: user.id });

  if (!resume) {
    return new Response(JSON.stringify({ message: 'Resume not found' }), { status: 404 });
  }

  return new Response(JSON.stringify({ resume }));
}

export async function PATCH(req, { params }) {
  const user = verifyToken(req);
  if (!user) return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  const { id } = await params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ message: 'Invalid resume ID' }), { status: 400 });
  }

  await connectDB();

  const body = await req.json();
  const { title, personalInfo = {} } = body;
  const requiredFields = ['fullName', 'email', 'phone', 'address'];
  const missingFields = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(personalInfo.email)) {
      return new Response(
          JSON.stringify({ message: "Invalid email format" }),
          { status: 400 }
      );
  }
  const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com"];
  const domain = personalInfo.email.split("@")[1].toLowerCase();

  if (!allowedDomains.includes(domain)) {
      return new Response(
          JSON.stringify({ message: "Please use a valid email provider" }),
          { status: 400 }
      );
  }

  if (!String(title || '').trim()) {
    missingFields.push('title');
  }

  if (!personalInfo || typeof personalInfo !== 'object') {
    missingFields.push(...requiredFields.map((field) => `personalInfo.${field}`));
  } else {
    for (const field of requiredFields) {
      if (!String(personalInfo[field] || '').trim()) {
        missingFields.push(`personalInfo.${field}`);
      }
    }
  }

  if (missingFields.length) {
    return new Response(
      JSON.stringify({
        message: 'Title and personal info are required',
        missingFields,
      }),
      { status: 400 }
    );
  }
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: id, userId: user.id },
      { ...body },
      { new: true }
    );

    if (!resume) {
      return new Response(JSON.stringify({ message: 'Resume not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Resume updated successfully', resume }));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const user = verifyToken(req);
  if (!user) return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ message: 'Invalid resume ID' }), { status: 400 });
  }

  await connectDB();

  const resume = await Resume.findOneAndDelete({ _id: id, userId: user.id });
  if (!resume) {
    return new Response(JSON.stringify({ message: 'Resume not found' }), { status: 404 });
  }

  return new Response(JSON.stringify({ message: 'Resume deleted successfully' }));
}
