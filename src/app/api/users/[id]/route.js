import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function PUT(req, context) {
    try {
        const { params } = context; // Correct way to get params
        const userId = Number(params.id); // Ensure it's a number
        const body = await req.json();

        console.log("Update request for user ID:", userId);
        console.log("Update payload:", body);

        if (!userId) {
            return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });
        }

        // Check if Prisma is correctly initialized
        if (!prisma.User) {
            console.error("Prisma model 'User' not found!");
            return new Response(JSON.stringify({ error: "Prisma model error" }), { status: 500 });
        }

        // Update user
        const updatedUser = await prisma.User.update({
            where: { id: userId },
            data: body,
        });

        return new Response(JSON.stringify(updatedUser), { status: 200 });
    } catch (error) {
        console.error("Prisma update error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}


// Handle DELETE (Delete User)
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    console.log("Delete request for user ID:", id);
    
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    // Convert ID to number since it comes as a string from URL params
    const userId = parseInt(id, 10);
    
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
    }
    
    // First check if the user exists
    const user = await prisma.user.findUnique({ 
      where: { id: userId } 
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Perform the delete with specific try/catch for Prisma errors
    try {
      await prisma.user.delete({ 
        where: { id: userId } 
      });
      
      console.log("User deleted successfully:", userId);
      return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (prismaError) {
      console.error("Prisma delete error:", prismaError);
      return NextResponse.json({ 
        error: "Database delete failed", 
        details: prismaError.message 
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ 
      error: "Server error during delete", 
      details: error.message 
    }, { status: 500 });
  }
}