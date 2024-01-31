"use client";
import { Image } from "@nextui-org/react";
import Link from "next/link";
import resizeUrl from "@/lib/common/imageUrl";

export type motionCardType = {
  id: string;
  name: string;
  imageUrl: string;
};

export default function MotionCard(data: motionCardType) {
  return (
    <>
      <Link href={`/motion/${data.id}`} target={"_blank"}>
        <div>
          <div className="flex felx-col max-w-[340px]">
            <Image
              className={"p-0 m-0"}
              src={resizeUrl(
                `https://live-image.monodev.cloud/${data.imageUrl}`,
              )}
            ></Image>
          </div>

          <p className={"mt-3"}>{data.name}</p>
        </div>
      </Link>
    </>
  );
}
