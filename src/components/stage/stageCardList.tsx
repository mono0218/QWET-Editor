"use client";
import StageUploadModal from "@/components/stage/stageUploadModal";
import StageCard, { stageCardType } from "@/components/stage/stageCard";

export default function StageCardList({
  data,
}: {
  data: Array<stageCardType>;
}) {
  return (
    <>
      <div className="flex justify-between">
        <h2 className={"text-xl mb-10 font-bold"}>おすすめのステージ</h2>
        <StageUploadModal />
      </div>

      <div className="grid gap-x-8 gap-y-4 grid-cols-3">
        {data.map((_data) => (
          <StageCard {..._data} key={_data.id} />
        ))}
      </div>
    </>
  );
}
