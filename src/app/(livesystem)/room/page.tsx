"use client";

import {
  Button,
  Image,
  RadioGroup,
  ScrollShadow,
  Radio,
} from "@nextui-org/react";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CharacterModel } from "@/types/vroidAPI.types";

export default function Page() {
  const [Data, setData] = useState([]);

  const [isSend, setIsSend] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const avatarData = await fetch("/api/avatar/like?count=100");
      const _avatar = await avatarData.json();
      const avatar = _avatar.data;
      setData(avatar);
    })();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSend(true);
    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/room", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.status != 200) {
      alert(`エラーが発生しました\nError: ${result.message}`);
      setIsSend(false);
    }

    await router.push(`/room/${result.uuid}`);
  };

  return (
    <div className="ml-72 mr-72 mt-10">
      {Data ? (
        <div>
          <form onSubmit={onSubmit} className="grid gap-10 items-center">
            <h1 className="text-4xl font-bold text-center pb-5">
              ライブをつくる！！
            </h1>
            <Input
              isRequired
              type="string"
              label="ステージUUID"
              name="stageUUID"
            />

            <Input
              isRequired
              type="string"
              label="モーションUUID"
              name="motionUUID"
            />

            <Input isRequired type="url" label="楽曲URL" name="movieUrl" />

            <h1 className="text-2xl font-bold text-center">アバター選択</h1>
            <ScrollShadow className="w-full h-[400px]">
              <RadioGroup name="avatarUrl">
                <div className="grid gap-x-8 gap-y-4 grid-cols-6">
                  {Data.map((_data: CharacterModel) => (
                    <div key={_data.id}>
                      <div className="flex felx-col max-w-[170px]">
                        <Image
                          isZoomed
                          src={_data.portrait_image.w600.url2x}
                        ></Image>
                      </div>

                      <Radio value={_data.id} className={"mt-3 items-start"}>
                        {_data.character.name}
                      </Radio>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </ScrollShadow>
            {isSend ? (
              <p className="text-center">送信中...</p>
            ) : (
              <Button type="submit">作る</Button>
            )}
          </form>
        </div>
      ) : (
        <p>Now Loading...</p>
      )}
    </div>
  );
}
