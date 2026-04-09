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
  try {
    const newResume = new Resume({
      userId: user.id,
      ...body,
    });
    await newResume.save();
    return new Response(JSON.stringify({ message: 'Resume created successfully', resume: newResume }));
  } catch (error) {
    console.error(error);
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