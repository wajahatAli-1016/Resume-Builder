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

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return new Response(JSON.stringify({ message: 'Invalid resume ID' }), { status: 400 });
  }

  await connectDB();

  const resume = await Resume.findOneAndDelete({ _id: params.id, userId: user.id });
  if (!resume) {
    return new Response(JSON.stringify({ message: 'Resume not found' }), { status: 404 });
  }

  return new Response(JSON.stringify({ message: 'Resume deleted successfully' }));
}
