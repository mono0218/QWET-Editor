export default async function Page(){
    const page = await fetch("http://localhost:3000/api/stage/6")
    console.log(page)
    return(
        <>
        </>
    )
}
