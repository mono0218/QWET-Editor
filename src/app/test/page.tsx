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

    return(
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" name="name"/>
                <input type="text" name="content"/>
                <input type="text" name="license"/>
                <input type="file" name="file"/>
                <button type="submit">Submit</button>
            </form>

        </div>
    )
}
