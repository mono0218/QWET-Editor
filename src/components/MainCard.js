"use client"
import {
    Autocomplete,
    AutocompleteItem
} from "@nextui-org/react";
import {Button} from "@nextui-org/react";
import {Card, CardBody} from "@nextui-org/react";
import {useState} from "react";
import { redirect,useRouter } from "next/navigation";
import Link from "next/link";


export default function MainCard(json){
    const onInputChange = (value) => {
        console.log(json.data[value -1])
        setdata(json.data[value -1])
    };

    const [data,setdata] = useState(json.data[0])

    let count =0

    return(
        <main className="p-20 h-full">
            <div className="flex justify-between mb-10 items-center">
                <Autocomplete label="Select an Stage" className="max-w-xs" defaultItems={json.data[0].attributes.accessToken} defaultInputValue={json.data[0].attributes.accessToken} onSelectionChange={onInputChange}>
                    {json.data.map((_data)=>{
                        count +=1
                        return(
                            <AutocompleteItem key={count} textValue={_data.attributes.accessToken}>
                                <p>{_data.attributes.accessToken}</p>
                            </AutocompleteItem>
                        )
                    })}
                </Autocomplete>
                <Button className="max-w-xs" onClick={()=>{createStage().then((data) => json.data.push(data))}}> + New Stage</Button>
            </div>
            <DataCard {...data}/>
        </main>
    )
}

function DataCard(data){
    if(data !== undefined){
        return (
            <Card className="h-full">
                <CardBody>
                    <div className="flex justify-between">
                        <div className="flex flex-col">
                            {data.id}

                        </div>
                        <div className="flex flex-col">
                            <Button className="max-w-xs" color="danger" onClick={()=>{deleteStage(data.id).then()}}> Remove</Button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        )
    }else{
        return (
            <Card className="h-full">
                <CardBody>
                    <div className="flex justify-between">
                        <div className="flex flex-col">
                            データがありません。ステージを選択するか、作成してください
                        </div>
                        <div className="flex flex-col">
                        </div>
                    </div>
                </CardBody>
            </Card>
        )
    }
}

async function createStage(){
    const data = await fetch("/api/createStage",{
        method: "POST"
    })
    return data
}

async function deleteStage(id){
    const data= await fetch(`/api/deleteStage/${id}`,{
        method: "DELETE"
    })
}

