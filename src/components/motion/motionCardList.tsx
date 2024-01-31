"use client";
import MotionCard, { motionCardType } from "@/components/motion/motionCard";
import MotionUploadModal from "@/components/motion/motionUploadModal";

export default function MotionCardList({
  data,
}: {
  data: Array<motionCardType>;
}) {
  return (
    <>
      <div className="flex justify-between">
        <h2 className={"text-xl mb-10 font-bold"}>おすすめのモーション</h2>
        <MotionUploadModal />
      </div>

      <div className="grid gap-x-8 gap-y-4 grid-cols-3">
        {data.map((_data) => (
          <MotionCard {..._data} key={_data.id} />
        ))}
      </div>
    </>
  );
}
