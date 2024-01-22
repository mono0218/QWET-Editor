import {CharacterModel} from "@/types/vroidAPI.types";

export type retrunType ={
    data:Array<CharacterModel>
}

async function fetchAPI(url:string,token:string):Promise<retrunType>{
    const result = await fetch(url,{
        headers:{
            'X-Api-Version': '11',
            Authorization: `Bearer ${token}`,
        }
    })

    return await result.json()
}

export async function getUserPostModel(token: string):Promise<retrunType>{
    return await fetchAPI("https://hub.vroid.com/api/account/character_models",token)
}

export async function getHeartModel(token:string):Promise<retrunType>{
    return await fetchAPI("https://hub.vroid.com/api/hearts",token)
}

export async function getStaffRecommendModel(token:string):Promise<retrunType> {
    return await fetchAPI("https://hub.vroid.com/api/staff_picks", token)
}
