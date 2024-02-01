import { Scene } from "@babylonjs/core";
import Songle from "songle-api/lib/api";

export async function songleController(
  scene: Scene,
  accessToken: string,
  secretToken: string,
  movieUrl: string,
) {
  scene.getAnimationGroupByName("Take1").stop()

  const player = new Songle.Player({
    mediaElement: document.querySelector("div.media"),
    accessToken: accessToken,
    secretToken: secretToken,
  });

  player.addPlugin(new Songle.Plugin.SongleSync());
  player.useMedia(movieUrl);

  player.on("mediaReady", function () {
    player.play();
  });

  player.on("mediaPlay", function () {
    const frame = (player.positionTime / 1000) * 60 + 35;

    scene.getAnimationGroupByName("Take1").goToFrame(frame);
    scene.getAnimationGroupByName("Take1").start(false);
  });

  player.on("")
}
