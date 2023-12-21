"use client"
import {
    Autocomplete,
    AutocompleteItem
} from "@nextui-org/react";
import {Button} from "@nextui-org/react";
import {Card, CardBody} from "@nextui-org/react";
import {useState} from "react";

export default function MainCard(json){
    const [data,setdata] = useState({})

    const onInputChange = (value) => {
        console.log(json.data[value -1])
        setdata(json.data[value -1])
    };
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

                    <Button className="max-w-xs"> + New Stage</Button>
                </div>


                <Card className="h-full">
                    <CardBody>
                        <div className="flex justify-between">
                            <div className="flex flex-col">

                            </div>

                            <div className="flex flex-col">
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </main>
        )

}