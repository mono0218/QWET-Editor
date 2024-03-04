import {Quaternion, Scene, Vector3} from "@babylonjs/core";
import * as mediasoupClient from "mediasoup-client";
import {AppData, WebRtcTransport} from "mediasoup/node/lib/types";
import {io} from "socket.io-client";
interface createWebRtcTransportResponse {
    recvMotionTransport: WebRtcTransport
    recvAudioTransport: WebRtcTransport
}

export class liverRecvRtc{
    scene: Scene
    listener: any

    device: mediasoupClient.Device
    socket: any

    isLiverConnected: boolean = false

    recvMotionTransport: mediasoupClient.types.Transport<AppData> | undefined
    recvAudioTransport: mediasoupClient.types.Transport<AppData> | undefined
    motionConsumer: mediasoupClient.types.DataConsumer<mediasoupClient.types.AppData> | undefined
    audioConsumer: mediasoupClient.types.Consumer<mediasoupClient.types.AppData> | undefined

    constructor(scene:Scene) {
        this.scene = scene
        this.device = new mediasoupClient.Device()
        this.socket = io(`${import.meta.env.VITE_LIVER_WEBSOCKET_SERVER_ADDRESS}`,{
            query: {
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

        await this.isAlreadyConnection()

        //await this.reconnRecvConsumer()

        console.debug("WebRTC Started")
    }

    async getRoom(roomId:string){
        await this.sendRequest("getRoom", { roomId: roomId })
    }

    async getRouterRtpCapabilities(){
        const routerRtpCapabilities = await this.sendRequest("getRouterRtpCapabilities", {})
        await this.device.load({routerRtpCapabilities:routerRtpCapabilities})
    }

    async isAlreadyConnection(){
        await this.createWebRtcTransport()
        await this.recvConsumer()
    }

    async createWebRtcTransport(){
        const webRtcTransportResponse:createWebRtcTransportResponse = await this.sendRequest("getListenerTransport",{})
        this.recvMotionTransport = await this.connectConsumeTransport(webRtcTransportResponse.recvMotionTransport)
        this.recvAudioTransport =  await this.connectConsumeTransport(webRtcTransportResponse.recvAudioTransport)
    }

    async connectConsumeTransport(params: any){
        let transport = this.device.createRecvTransport(params);

        transport.on('connect', async ({ dtlsParameters }, callback) => {
            await this.sendRequest('getConnection', {id: transport.id, dtlsParameters})
            callback()
        })

        return transport
    }

    async recvConsumer(){
        let motionProps = await this.sendRequest("getMotionConsumer", {id: this.recvMotionTransport.id})
        let audioProps = await this.sendRequest("getAudioConsumer", {id: this.recvAudioTransport.id, kind:"audio", rtpParameters: this.device.rtpCapabilities})

        if (motionProps.status == "wait") {
            this.socket.once("liverMotionConnected", async () => {
                motionProps = await this.sendRequest("getMotionConsumer", {id: this.recvMotionTransport.id})
                this.motionConsumer = await this.recvMotionTransport.consumeData(motionProps.params)
                this.motionConsumer.on('message', (message:string) => {
                    this.motionAvatar(this.scene,message)
                })
            })
        }

        if (audioProps.status == "wait"){
            this.socket.once("liverAudioConnected", async () => {
                audioProps = await this.sendRequest("getAudioConsumer", {id: this.recvAudioTransport.id, kind:"audio", rtpParameters: this.device.rtpCapabilities})
                this.audioConsumer = await this.recvAudioTransport.consume(audioProps.params)
                this.playAudio(this.audioConsumer.track)
            })
            return
        }

        this.motionConsumer = await this.recvMotionTransport.consumeData(motionProps.params)
        this.audioConsumer = await this.recvAudioTransport.consume(audioProps.params)
        this.playAudio(this.audioConsumer.track)

        this.motionConsumer.on('message', (message:string) => {
            this.motionAvatar(this.scene,message)
        })
    }

    async reconnRecvConsumer(){
        let motionProps
        let audioProps

        this.socket.on("liverMotionConnected", async () => {
            if (!this.isLiverConnected) return
            motionProps = await this.sendRequest("getMotionConsumer", {id: this.recvMotionTransport.id})
            this.motionConsumer = await this.recvMotionTransport.consumeData(motionProps.params)
            this.motionConsumer.on('message', (message:string) => {
                this.motionAvatar(this.scene,message)
            })
        })

        this.socket.on("liverAudioConnected", async () => {
            if (!this.isLiverConnected) return
            audioProps = await this.sendRequest("getAudioConsumer", {id: this.recvAudioTransport.id, kind:"audio", rtpParameters: this.device.rtpCapabilities})
            this.audioConsumer = await this.recvAudioTransport.consume(audioProps.params)
            this.playAudio(this.audioConsumer.track)
        })

        if(this.isLiverConnected){
            this.motionConsumer = await this.recvMotionTransport.consumeData(motionProps.params)
            this.audioConsumer = await this.recvAudioTransport.consume(audioProps.params)
            this.playAudio(this.audioConsumer.track)

            this.motionConsumer.on('message', (message:string) => {
                this.motionAvatar(this.scene,message)
            })
        }
    }

    async sendRequest(type:string, data:any):Promise<any>{
        return new Promise((resolve) => {
            this.socket.emit(type, data, (res:any) => resolve(res));
        });
    }

    async playAudio(track:MediaStreamTrack){
        const audio = new Audio();
        audio.autoplay = true;
        audio.srcObject = new MediaStream([track])
    }

    motionAvatar(scene:Scene,recvData){
        const data = JSON.parse(recvData);
        console.log(data)

        data.map((d:any) => {
            const name = d.name
            if(name){
                const node = scene.getTransformNodeByName(name);
                if(node){
                    node.position = new Vector3(d.x,d.y,d.z);
                    node.rotationQuaternion = new Quaternion(d.qx,d.qy,d.qz,d.qw)
                }
            }else{
                console.log("node not found",d.name)
            }
        })
    }
}
