"use client";
import UserDetailsCard, { UserDetailsType } from "@/components/userDetailsCard";
import React, { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const [Data, setData] = useState<UserDetailsType>();
  const [isData, setisData] = useState(false);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/user/${params.id}`);
      const data = await response.json();

      if (response.status === 200) {
        setisData(true);
        const _data: UserDetailsType = {
          userId: data.data.id,
          name: data.data.name,
          content: data.data.content,
          imageUrl: data.data.iconUrl,
        };

        setData(_data);
        setLoading(false);
      } else {
        setLoading(false);
        setisData(false);
      }
    })();
  }, []);

  return (
    <>
      {Loading ? (
        <p className="text-center text-xl">Now Loading...</p>
      ) : (
        <div>
          {isData ? (
            <div className="ml-32 mr-32">
              <UserDetailsCard {...Data} />
            </div>
          ) : (
            <p className="text-center text-xl">データーが存在しません</p>
          )}
        </div>
      )}
    </>
  );
}
