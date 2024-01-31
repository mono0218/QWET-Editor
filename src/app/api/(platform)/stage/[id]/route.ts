import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { options } from "../../../../../../auth.config";
import { StageStorage } from "@/lib/stage/stageStorage";
import { stageDB } from "@/lib/stage/stageDB";
import { ImageStorage } from "@/lib/common/imageStorage";
const db = new stageDB();
const fileStorage = new StageStorage();
const imageStorage = new ImageStorage();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const result = await db.Get({ uuid: params.id });

    if (result === null) {
      return NextResponse.json({ message: "NotFound" }, { status: 404 });
    }

    return NextResponse.json({ data: result }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Database Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const result = await db.Get({ uuid: params.id });
  const session = await getServerSession(options);

  if (result.user.id != Number(session.user.id)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    await fileStorage.remove({ url: result.fileUrl });
    await imageStorage.remove({ url: result.imageUrl });
  } catch (e) {
    return NextResponse.json({ message: "R2 Storage Error" }, { status: 500 });
  }

  try {
    await db.Remove({
      uuid: result.uuid,
      userId: Number(session.user.id),
    });
    return NextResponse.json({ message: "Success Removed" }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "Not Found" }, { status: 404 });
  }
}
