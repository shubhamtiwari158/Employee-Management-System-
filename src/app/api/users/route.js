import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { saveImage } from '@/lib/uploadHandler';

// GET all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST new user
export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Handle image upload
    const imagePath = await saveImage(formData);
    
    if (!imagePath) {
      return NextResponse.json(
        { error: 'Profile image is required' },
        { status: 400 }
      );
    }
    
    // Get other form data
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const linkedinUrl = formData.get('linkedinUrl');
    
    // Validate required fields
    if (!name || !email || !phone || !linkedinUrl) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        linkedinUrl,
        profileImage: imagePath,
      },
    });
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}