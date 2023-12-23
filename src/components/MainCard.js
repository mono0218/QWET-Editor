"use client"
import {Autocomplete, AutocompleteItem, Button, Card, CardBody} from "@nextui-org/react";
import {useState} from "react";
import {getCurrentUser} from "../../utils/getCurrentUser";


export default function MainCard(json){
    const onInputChange = (value) => {
        setdata(json.data[value -1])
    };

    let count = 0

    const [data,setdata] = useState(json.data[0])

    return(
        <main className="p-20 h-full">
            <div className="flex justify-between mb-10 items-center">
                <Autocomplete label="Select an Stage" className="max-w-xs" defaultItems={json.data[0].attributes.access_token} defaultInputValue={json.data[0].attributes.access_token} onSelectionChange={onInputChange}>
                    {json.data.map((_data)=>{
                        count +=1

                        return(
                            <AutocompleteItem key={count} textValue={_data.attributes.access_token}>
                                <p>{_data.attributes.access_token}</p>
                            </AutocompleteItem>
                        )
                    })}
                </Autocomplete>
                <Button className="max-w-xs" onClick={()=>{}}> + New Stage</Button>
            </div>
            <Card className="h-full">
                <CardBody>
                    <div className="flex justify-between">
                        <div className="flex flex-col">
                            {data.id}
                        </div>
                        <div className="flex flex-col">
                            <Button className="max-w-xs" color="danger" onClick={()=>{}}> Remove</Button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </main>
    )
}

async function createStage(){
    let response
    await fetch("/api/stage/create",{
        method: "POST"
    }).then((response) => response.json()).then((data) => {response = data})
    return response
}

async function deleteStage(id){
    const data= await fetch(`/api/stage/delete/${id}`,{
        method: "DELETE"
    })
}