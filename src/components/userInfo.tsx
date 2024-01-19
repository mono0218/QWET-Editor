import {CharacterModel} from "@/types/vroidAPI.types";
import {Avatar, Button, Image, Link} from "@nextui-org/react";
import React from "react";

export default function UserInfo(){
    return(
        <>
            <div>
                <div className="w-full h-48 bg-blue-400 z-0　relative"/>

                <div className="flex justify-between">
                    <div>
                        <div className="flex flex-1">
                            <div className=" inline-block -mt-16 w-32 ml-12">
                                <Avatar src="https://s.pximg.net/common/images/no_profile.png"
                                        className={"w-52 h-52"}></Avatar>
                            </div>
                        </div>
                        <div>
                            <p className="ml-12 text-2xl font-bold p-1">菜園 もももやしの</p>
                            <Link href={`https://pixiv.net/users/70762708`}
                                  className={"ml-12"}>https://pixiv.net/users/70762708</Link>
                        </div>
                    </div>

                    <div>
                        <h1>あああああ</h1>
                    </div>

                    <div>
                        <Button　className="mt-10" color="primary">プロフィール文を変更する</Button>
                    </div>
                </div>
            </div>
        </>
    )
}
