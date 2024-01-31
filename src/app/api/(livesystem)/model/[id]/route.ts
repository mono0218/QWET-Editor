import { getModelUrl } from "@/lib/vroid/VroidInfo";
import { getServerSession } from "next-auth/next";
import { options } from "@/../auth.config";
import { NextResponse } from "next/server";

export async function GET(req, { params }: { params: { id: string } }) {
  const session = await getServerSession(options);
  const url = await getModelUrl(session.user.accessToken, params.id);

  return NextResponse.json({ url: url });
}
