import {Scene} from "@babylonjs/core";
import Songle from "songle-api/lib/api";

export async function songleController(scene: Scene,accessToken:string,secretToken:string,movieUrl:string){

    let player = new Songle.Player({
        mediaElement: document.querySelector('div.media'),
        accessToken: accessToken,
        secretToken: secretToken
    });

    player.addPlugin(new Songle.Plugin.SongleSync());
    player.useMedia(movieUrl);

    player.on("mediaReady",
        function (ev) {
            player.play();
        }
    );

    player.on("mediaPlay",
        function (ev) {
            let frame = player.positionTime / 1000 * 60 + 35

            scene.getAnimationGroupByName("Take1").goToFrame(frame)
            scene.getAnimationGroupByName("Take1").start(false)
        }
    )
}
