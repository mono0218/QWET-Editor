import {getJson, ImportWithAnimation} from "@/lib/vrm/index";
import {vrmJsonConvert} from "@/lib/vrm/vrmJsonConvert";
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader";
import {GLTFFileLoader} from "@babylonjs/loaders";
import {liveProps} from "@/app/(livesystem)/room/[id]/liveComponent";
import {Scene} from "@babylonjs/core";
import {getSession} from "next-auth/react";

class VRMFileLoader extends GLTFFileLoader {
    public name = 'vrm';
    public extensions = {
        '.vrm': {isBinary: true},
    };

    public createPlugin() {
        return new VRMFileLoader();
    }
}

export async function assetLoader(liveData:liveProps, scene: Scene){
    const session = await getSession()
    SceneLoader.RegisterPlugin(new VRMFileLoader());

    const vrmUrl = await fetch (`/api/model/${liveData.modelUrl}`)
    const vrm = await fetch((await vrmUrl.json()).url)
    const motion = await fetch(liveData.motionUrl);
    const stage = await fetch(liveData.stageUrl)

    const vrmArraybuffer:ArrayBuffer = await vrm.arrayBuffer()
    const animationFile = new File([await motion.arrayBuffer()], "animation.glb")
    await SceneLoader.ImportMeshAsync("", "", new File([await stage.arrayBuffer()], "stage.glb"), scene)
    const result = await getJson(vrmArraybuffer)

    if (result.json.extensions.VRMC_vrm) {
        console.log("1.X")

        const vrmFile = new File([vrmArraybuffer], "model.vrm")
        await ImportWithAnimation("01", vrmFile, animationFile, scene)
    } else if (result.json.extensions.VRM) {
        console.log("0.X")

        const converter = new vrmJsonConvert()
        const convertedFile = await converter.coordinateConvert(vrmArraybuffer)
        await ImportWithAnimation("01", convertedFile, animationFile, scene)
    }
}
