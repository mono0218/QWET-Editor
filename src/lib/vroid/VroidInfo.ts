import {CharacterModel} from "@/types/vroidAPI.types";

export type retrunType ={
    data:Array<CharacterModel>
}

async function fetchAPI(url:string,token:string,count:number):Promise<retrunType>{
    const result = await fetch(`${url}?count=${count}`,{
        headers:{
            'X-Api-Version': '11',
            Authorization: `Bearer ${token}`,
        }
    })

    return await result.json()
}

export async function getUserPostModel(token: string,count:number):Promise<retrunType>{
    return await fetchAPI("https://hub.vroid.com/api/account/character_models",token,count)
}

export async function getHeartModel(token:string,count:number):Promise<retrunType>{
    return await fetchAPI("https://hub.vroid.com/api/hearts",token,count)
}

export async function getStaffRecommendModel(token:string,count:number):Promise<retrunType> {
    return await fetchAPI("https://hub.vroid.com/api/staff_picks",token,count)
}
