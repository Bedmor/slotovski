import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await auth();
        if (!session?.user) {
          throw new Error("Unauthorized");
        }

        // Only allow uploading images
        // You can also check file size here if needed
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/gif"],
          tokenPayload: JSON.stringify({
            userId: session.user.id,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to test the full upload flow

        console.log("blob uploaded", blob.url);

        try {
          if (tokenPayload) {
            const { userId } = JSON.parse(tokenPayload) as { userId: string };

            // Update user profile with new image URL
            await db.user.update({
              where: { id: userId },
              data: { image: blob.url },
            });
          }
        } catch {
          throw new Error("Could not update user");
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
