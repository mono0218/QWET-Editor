export async function  getBuffer(file:File){
    return Buffer.from(await file.arrayBuffer());
}
