import { NextRequest, NextResponse } from "next/server";
import { getStaffRecommendModel } from "@/lib/vroid/VroidInfo";
import { getServerSession } from "next-auth/next";
import { options } from "../../../../../auth.config";

export async function GET(req: NextRequest) {
  const session = await getServerSession(options);
  const { searchParams } = new URL(req.url);
  const count = searchParams.get("count");

  if (count === null) {
    return NextResponse.json({ message: "count is required" }, { status: 400 });
  }

  try {
    const result = await getStaffRecommendModel(
      session.user.accessToken,
      Number(count),
    );
    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Not Found" }, { status: 404 });
  }
}
