import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure Prisma is correctly imported

export async function PUT(request, { params }) {
  try {
    console.log("Received Request:", { params }); // ✅ Debugging

    if (!params || !params.id) {
      console.error("Missing user ID in params");
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const userId = Number(params.id);
    if (isNaN(userId)) {
      console.error("Invalid user ID:", params.id);
      return NextResponse.json({ error: "Invalid user ID" }, { status:400 });
    }

    const data = await request.json();
    console.log("Received Data:", data); // ✅ Debugging

    // Validate data before updating
    if (!data.name || !data.email) {
      console.error("Missing required fields:", data);
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        linkedinUrl: data.linkedinUrl || null,
      },
    });

    console.log("Updated User:", updatedUser); // ✅ Debugging
    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error) {
    console.error("Internal Server Error:", error); // ✅ Log full error
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}

  

export async function DELETE(request, { params }) {
  try {
    const userId = Number(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: 'Database error: ' + error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
