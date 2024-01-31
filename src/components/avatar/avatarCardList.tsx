"use client";
import AvatarCard, { AvatarCardType } from "@/components/avatar/avatarCard";

export default function AvatarCardList({
  data,
}: {
  data: Array<AvatarCardType>;
}) {
  return (
    <>
      <h2 className={"text-xl mb-10 font-bold"}>おすすめのアバター</h2>

      <div className="grid gap-x-8 gap-y-4 grid-cols-6">
        {data.map((_data) => (
          <AvatarCard {..._data} key={_data.character_model.id} />
        ))}
      </div>
    </>
  );
}
