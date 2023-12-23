import Image from 'next/image'
import MainCard from "@/components/MainCard.js";

export default async function Home() {
  let json

  await fetch("http://localhost:3000/api/stage/get", {cache: "no-store"}).then(response => response.json()).then((data)=>{
    json = data
  })

  return(
      <MainCard {...json}/>
  )
}
