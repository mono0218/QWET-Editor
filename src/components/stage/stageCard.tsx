"use client";
import { Image, Link } from "@nextui-org/react";
import resizeUrl from "@/lib/common/imageUrl";

export type stageCardType = {
  id: string;
  name: string;
  imageUrl: string;
};

export default function StageCard(data: stageCardType) {
  return (
    <>
      <Link href={`/stage/${data.id}`} target={"_blank"}>
        <div>
          <div className="flex felx-col max-w-[340px]">
            <Image
              isZoomed
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
