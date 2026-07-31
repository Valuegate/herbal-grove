import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { generateTemporaryPassword } from "@/lib/generateTemporaryPassword";

export async function POST(req: Request) {
  try {
    const { name, email, role } = await req.json();

    const client = await clerkClient();

    const temporaryPassword = generateTemporaryPassword();

    const [firstName, ...rest] = name.trim().split(" ");

    const lastName = rest.join(" ");

    const user = await client.users.createUser({
      firstName,
      lastName,
      emailAddress: [email],
      password: temporaryPassword,

      publicMetadata: {
        role,
        mustChangePassword: true,
      },
    });

    return NextResponse.json({
      success: true,
      userId: user.id,
      temporaryPassword,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to create user.",
      },
      {
        status: 500,
      }
    );
  }
}