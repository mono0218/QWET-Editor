import * as mediasoupClient from "mediasoup-client";
import {AppData, WebRtcTransport} from "mediasoup/node/lib/types";
import {io} from "socket.io-client";
interface createWebRtcTransportResponse {
    sendMotionTransport: WebRtcTransport
    sendAudioTransport: WebRtcTransport
}

export class liverSendRtc{
    device: mediasoupClient.Device
    socket: any

    stream:MediaStream

    sendMotionTransport: mediasoupClient.types.Transport<AppData> | undefined
    sendAudioTransport: mediasoupClient.types.Transport<AppData> | undefined
    motionProducer: mediasoupClient.types.DataProducer<mediasoupClient.types.AppData> | undefined
    audioProducer: mediasoupClient.types.Producer<mediasoupClient.types.AppData>

    constructor(stream:MediaStream) {
        this.device = new mediasoupClient.Device()
        this.socket = io(`${import.meta.env.VITE_LIVER_WEBSOCKET_SERVER_ADDRESS}`)
        this.stream = stream
    }

    async init(){
        console.debug("WebRTC initializing...")

        await this.getRoom("test")
        console.debug("Room created")

        await this.getRouterRtpCapabilities()
        console.debug("Router RTP Capabilities")

        await this.createWebRtcTransport()

        await this.openProducer()

        console.debug("WebRTC Started")
    }

    async getRoom(roomId:string){
        await this.sendRequest("getRoom", { roomId: roomId })
    }

    async getRouterRtpCapabilities(){
        const routerRtpCapabilities = await this.sendRequest("getRouterRtpCapabilities", {})
        await this.device.load({routerRtpCapabilities:routerRtpCapabilities})
    }

    async createWebRtcTransport(){
        const webRtcTransportResponse:createWebRtcTransportResponse = await this.sendRequest("getLiverTransport",{})

        this.sendMotionTransport = await this.connectProducerTransport("producedata",webRtcTransportResponse.sendMotionTransport)
        this.sendAudioTransport =  await this.connectProducerTransport("produce",webRtcTransportResponse.sendAudioTransport)
    }

    async connectProducerTransport(dir:"producedata" | "produce",params: any){
        let transport = this.device.createSendTransport(params);

        transport.on('connect', async ({ dtlsParameters }, callback) => {
            await this.sendRequest('getConnection', {id: transport.id, dtlsParameters})
            callback()
        })

        if ( dir === "producedata" ){
            transport.on("producedata", async (data, callback) => {
                const { id } = await this.sendRequest("getLiverMotionProducer", { id: transport.id, parameters:data.sctpStreamParameters})
                callback({ id: id })
            })

        }else if ( dir === "produce" ){
            transport.on("produce", async (data, callback) => {
                const { id } = await this.sendRequest("getLiverAudioProducer", { id: transport.id, parameters:data.rtpParameters})
                callback({ id: id })
            })
        }

        return transport
    }

    async openProducer(){
        this.motionProducer = await this.sendMotionTransport.produceData()
        this.audioProducer = await this.sendAudioTransport.produce({
            track: this.stream.getAudioTracks()[0],
        })
    }

    async sendProducerData(data:string){
        this.motionProducer.send(data)
    }

    async sendRequest(type:string, data:any):Promise<any>{
        return new Promise((resolve) => {
            this.socket.emit(type, data, (res:any) => resolve(res));
        });
    }
}

