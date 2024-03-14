import {ListenerLiveScene} from "../../lib/liveSystem/listener/listenerLiveScene.ts";
import {SendRecvListener} from "../../lib/liveSystem/listener/sendRecvListener.ts";
import {liverRecvRtc} from "../../lib/liveSystem/listener/recvLiver.ts";
import {useEffect} from "react";

export default function ListenerPage() {
    useEffect(() => {
        (async ()=>{
            const liveScene = new ListenerLiveScene();
            await liveScene.init();

            if (!liveScene.scene) {
                alert('シーンの取得に失敗しました.\nページをリロードしてください.');
                return;
            }

            const webRtc = new SendRecvListener(liveScene.scene);
            await webRtc.init();

            const liverRecv = new liverRecvRtc(liveScene.scene);
            await liverRecv.init();
        })();
    }, []);
    return (
        <></>
    )
}
