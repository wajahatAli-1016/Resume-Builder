import { connectDB } from '@/app/lib/db';
import Resume from '../../models/Resume';
import { verifyToken } from '@/app/lib/auth';


// Creating a new resume
export async function POST(req) {
  const user = verifyToken(req);

  if (!user) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
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
    const newResume = new Resume({
      userId: user.id,
      ...body,
    });
    await newResume.save();
    return new Response(JSON.stringify({ message: 'Resume created successfully', resume: newResume }));
  } catch (error) {
    console.error(error);
    if (error?.name === 'ValidationError') {
      return new Response(
        JSON.stringify({
          message: error.message || 'Validation failed for required resume fields',
        }),
        { status: 400 }
      );
    }
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

// Reading  all resume for a user
export async function GET(req) {
  const user = verifyToken(req);

  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  await connectDB();

  const resumes = await Resume.find({ userId: user.id });

  return new Response(JSON.stringify(resumes));
}

// Deleting a resume from id
export async function DELETE(req) {
  const user = verifyToken(req);

  if(!user) return new Response(JSON.stringify({ error: 'Unauthorized'}), { status: 401 });

  await connectDB();

  const { id } = await req.json();

  const resume = await Resume.findOneAndDelete({ _id: id, userId: user.id });

  if (!resume) {
    return new Response(JSON.stringify({ error: 'Resume not found' }), { status: 404 });
  }

  return new Response(JSON.stringify({ message: 'Resume deleted successfully' }));
}