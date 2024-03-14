import * as mediasoupClient from "mediasoup-client";
import {AppData, WebRtcTransport} from "mediasoup/node/lib/types";
import {io} from "socket.io-client";
import {Scene} from "@babylonjs/core";
import {listenerModel} from "./listenerModel.ts";
interface createWebRtcTransportResponse {
    sendTransport: WebRtcTransport
    recvTransport: WebRtcTransport
}

export class SendRecvListener {
    scene: Scene
    listener: any

    device: mediasoupClient.Device
    socket: any
    sendTransport: mediasoupClient.types.Transport<AppData> | undefined
    recvTransport: mediasoupClient.types.Transport<AppData> | undefined
    producer:  mediasoupClient.types.DataProducer<mediasoupClient.types.AppData> | undefined
    consumer: mediasoupClient.types.DataConsumer<mediasoupClient.types.AppData> | undefined

    constructor(scene:Scene) {
        this.scene = scene
        this.listener = new listenerModel(scene,this)

        this.device = new mediasoupClient.Device()
        this.socket = io(`${import.meta.env.VITE_LISTENER_WEBSOCKET_SERVER_ADDRESS}`,{
            query:{
                roomId: "test"
            }
        })
    }

    async init(){
        console.debug("WebRTC initializing...")

        await this.getRoom("test")
        console.debug("Room created")

        await this.getRouterRtpCapabilities()
        console.debug("Router RTP Capabilities")

        await this.createWebRtcTransport()
        console.debug("WebRTC Transport created")

        await this.openProducer()

        await Promise.all([
            this.AlreadyProducer(),
            this.newConsumer(),
            this.sendPosition()
        ])

        if (!this.consumer) return

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
        const webRtcTransportResponse:createWebRtcTransportResponse = await this.sendRequest("getTransport",{})

        this.sendTransport = await this.createProduceTransport(webRtcTransportResponse.sendTransport)
        this.recvTransport =  await this.createConsumeTransport(webRtcTransportResponse.recvTransport)
    }

    async createProduceTransport(params: any){
        const transport = this.device.createSendTransport(params);

        transport.on("connect",  async ({ dtlsParameters }:any,callback:any) => {
            await this.sendRequest("getConnection", { id: transport.id, dtlsParameters: dtlsParameters })
            callback();
        });

        transport.on("producedata",  async (parameters,callback:any) => {
            const { id } = await this.sendRequest("getProducer", { id: transport.id, parameters:parameters.sctpStreamParameters})
            callback({ id: id });
        });

        return transport
    }

    async createConsumeTransport(params: any){
        const transport = this.device.createRecvTransport(params);

        transport.on("connect",  async ({ dtlsParameters }:any,callback:any) => {
            await this.sendRequest("getConnection", { id: transport.id, dtlsParameters: dtlsParameters })
            callback();
        });

        return transport
    }

    async openProducer(){
        if(!this.sendTransport) return

        this.producer  = await this.sendTransport.produceData()
    }

    async AlreadyProducer(){
        const producers = await this.sendRequest("getAlreadyProducer", {})

        for (const id in producers) {
            if(id === this.producer?.id) continue
            await this.handleOpenConsumer(id)
        }
    }

    async newConsumer(){
        this.socket.on('newProducer', async (data:any) => {
            console.debug("新しいユーザーが参加しました")
            await this.handleOpenConsumer(data.producerId)

            return
        });
    }

    async handleOpenConsumer(producerId:string){
        if(!this.recvTransport) return
        const result = await this.sendRequest('getConsumer', {
            id: this.recvTransport.id,
            dataProducerId: producerId,
        });

        if (!this.recvTransport) return
        const consumer = await this.recvTransport.consumeData(result.params);
        await this.listener.createAvatar(consumer.id)

        consumer.on('open', () => {
            consumer.on('message', (message:string) => {
                this.listener.moveAvatar(consumer.id,message)
            });

            consumer.on('transportclose', () => {
                this.listener.removeAvatar(consumer.id)
            })

            consumer.on('close', () => {
                console.log("close")
                this.listener.removeAvatar(consumer.id)
            })
        })

        return
    }



    async sendPosition(){
        setInterval(() => {
            const position = this.scene.getCameraByName("camera1")!.position
            this.sendMessage(`${position.x},${position.y},${position.z}`)
        },1)
    }

    async sendMessage(data:string){
        if (!this.producer) return
        this.producer.send(data)
    }

    async sendRequest(type:string, data:any):Promise<any>{
        return new Promise((resolve) => {
            this.socket.emit(type, data, (res:string) => resolve(res));
        });
    }
}
