import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST() {
  try {
    const { userId } = await auth();

    console.log("AUTH USER:", userId);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const client = await clerkClient();

    const user = await client.users.getUser(userId);

    console.log("BEFORE:", user.publicMetadata);

    await client.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        mustChangePassword: false,
      },
    });

    const updated = await client.users.getUser(userId);

    console.log("AFTER:", updated.publicMetadata);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to update metadata.",
      },
      {
        status: 500,
      }
    );
  }
}