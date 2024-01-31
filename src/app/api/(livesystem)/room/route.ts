import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { options } from "@/../auth.config";
import { v4 } from "uuid";
import { RoomDB, roomDB } from "@/lib/room/roomDB";
import { stageDB } from "@/lib/stage/stageDB";
import { motionDB } from "@/lib/motion/motionDB";

const db = new roomDB();

export async function POST(req: NextRequest) {
  const session = await getServerSession(options);
  const formData = await req.formData();

  type Props = {
    uuid: string;
    apiUrl: string;
    masterKey: string;
    userKey: string;
    avatarUrl: string;
    motionUUID: string;
    movieUrl: string;
    stageUUID: string;
    userId: number;
  };

  const uuid: string = v4();

  //formDataをPropsに変換
  const data: Props = {
    uuid: uuid,
    apiUrl: "",
    masterKey: "",
    userKey: "",

    avatarUrl: formData.get("avatarUrl") as string,
    motionUUID: formData.get("motionUUID") as string,
    movieUrl: formData.get("movieUrl") as string,
    stageUUID: formData.get("stageUUID") as string,
    userId: Number(session.user.id as string),
  };

  //SongleAPIにmovieURL対応しているかの確認
  const songleResult = await fetch(
    `https://widget.songle.jp/api/v1/song.json?url=${data.movieUrl}`,
  );
  const songleJson = await songleResult.json();

  if (!songleJson.url) {
    return NextResponse.json(
      { message: "Songle Not Register" },
      { status: 400 },
    );
  }

  //motionUUIDとstageUUIDが存在するかの確認
  const stagedb = new stageDB();
  const motiondb = new motionDB();

  const stageResult = await stagedb.Get({ uuid: data.stageUUID });
  const motionResult = await motiondb.Get({ uuid: data.motionUUID });

  if (!stageResult || !motionResult) {
    return NextResponse.json(
      { message: "Stage or Motion Notfound" },
      { status: 400 },
    );
  }

  const result = await fetch(
    "https://api.songle.jp/api/v2/apps/2457/stages.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: process.env.SONGLEAPI_KEY,
      }),
    },
  );
  const json = await result.json();

  data.userKey = json.data.attributes.access_token;
  data.masterKey = json.data.attributes.secret_token;
  data.apiUrl = `https://api.songle.jp/api/v2/apps/2457/stages/${json.data.id}`;

  //DataBaseへの挿入データを作成
  const dbData: RoomDB = {
    uuid: data.uuid,
    userId: data.userId,
    apiUrl: data.apiUrl,
    masterKey: data.masterKey,
    userKey: data.userKey,

    movieUrl: data.movieUrl,
    avatarUrl: data.avatarUrl,
    motionUUID: data.motionUUID,
    stageUUID: data.stageUUID,
  };

  try {
    await db.Create(dbData);
    return NextResponse.json(
      { message: "Success", uuid: uuid },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json({ message: "Database Error" }, { status: 500 });
  }
}
