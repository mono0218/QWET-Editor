import {LiverAudio} from "../../lib/liveSystem/liver/liverAudio.ts";
import {liverSendRtc} from "../../lib/liveSystem/liver/sendLiver.ts";
import {LiveScene} from "../../lib/liveSystem/liver/liverLiveScene.ts";

export default function LiverPage(){
    const liveraudio = new LiverAudio();
    let SendRtc:liverSendRtc;
    liveraudio.init().then(async (stream) => {
            SendRtc = new liverSendRtc(stream);
            await SendRtc.init()

            const live = new LiveScene(SendRtc);
            document.getElementById("play").onclick = async () => {
                const data = await fetch(new URL("/public/aipai.glb", import.meta.url).href);
                await liveraudio.play();
                await live.createObjects(new File([await data.arrayBuffer()], "aipai.glb"));
                await live.loopSendPosition();
            };
        }
    )

    return (
        <>
            <h1>LiverMenu</h1>

            <button id="play">再生する</button>

            <canvas></canvas>
        </>
    )
}
