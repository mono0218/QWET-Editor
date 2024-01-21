"use client"
export default function Page(){
    const onSubmit = async (event)=>{
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const response = await fetch('/api/stage', {
            method: 'POST',
            body: formData,
        })

        console.log(response)
    }

    const onRemove = async (event)=>{
        const formData = new FormData(event.currentTarget)
        const result = await fetch(`/api/stage/${formData.get("id")}`,{
            method:"DELETE",
            redirect:"manual"
        })
    }

    const onClick = async (event)=>{
        const formData = new FormData(event.currentTarget)
        const result = await fetch(`/api/stage/${formData.get("id")}`,{
            method:"GET"
        })
        console.log(result)
    }

    return(
        <div>
            <p>POST</p>
            <form onSubmit={onSubmit}>
                <input type="text" name="name"/>
                <input type="text" name="content"/>
                <input type="text" name="license"/>
                <input type="file" name="file"/>
                <input type="file" name="image"/>
                <button type="submit">Submit</button>
            </form>

            <p>GET</p>
            <form onSubmit={onClick}>
                <input type="text" name="id"/>
                <button type="submit">Submit</button>
            </form>

            <p>DELETE</p>
            <form onSubmit={onRemove}>
                <input type="text" name="id"/>
                <button type="submit">Submit</button>
            </form>
        </div>


    )
}
