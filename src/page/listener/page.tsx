import {ListenerLiveScene} from "../../lib/liveSystem/listener/listenerLiveScene.ts";
import {SendRecvListener} from "../../lib/liveSystem/listener/sendRecvListener.ts";
import {liverRecvRtc} from "../../lib/liveSystem/listener/recvLiver.ts";
import {useEffect} from "react";
import {liverSendRtc} from "../../lib/liveSystem/liver/sendLiver.ts";

export default function ListenerPage() {
    const liveScene = new ListenerLiveScene();

    //const webRtc = new SendRecvListener(liveScene.scene);
    //webRtc.init();

    const liverRecv = new liverRecvRtc(liveScene.scene);
    liverRecv.init();

    useEffect(() => {
        setInterval(() => {
            console.log(liveScene.getfps());
        })
    }, []);
    return (
        <></>
    )
}
