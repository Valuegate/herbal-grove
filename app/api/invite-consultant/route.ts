import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { email, role } = await req.json();

    const client = await clerkClient();

    const invitation = await client.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/accept-invite`,
      // Role rides along on the invitation itself — it lands in the
      // user's publicMetadata automatically once they accept, with no
      // separate "assign role" step needed afterward.
      publicMetadata: { role },
    });

    return NextResponse.json({
      success: true,
      invitationId: invitation.id,
    });
  } catch (error: any) {
    console.error(error);

    // Clerk returns a specific error when the email was already invited
    // or already belongs to a user — surface that distinctly.
    const alreadyExists =
      error?.errors?.[0]?.code === "duplicate_record" ||
      error?.status === 422;

    return NextResponse.json(
      {
        success: false,
        error: alreadyExists
          ? "That email has already been invited or already has an account."
          : "Unable to send invitation.",
      },
      { status: alreadyExists ? 409 : 500 }
    );
  }
}