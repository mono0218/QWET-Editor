import {getJson, ImportWithAnimation} from "@/lib/vrm/index";
import {vrmJsonConvert} from "@/lib/vrm/vrmJsonConvert";
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader";
import {GLTFFileLoader} from "@babylonjs/loaders";
import {liveProps} from "@/app/(livesystem)/babylon/components/MMD";
import {Scene} from "@babylonjs/core";

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
    SceneLoader.RegisterPlugin(new VRMFileLoader());

    const vrm = await fetch(liveData.modelUrl);
    const animation = await fetch(liveData.motionUrl);
    const stage = await fetch(liveData.stageUrl);

    const vrmArraybuffer = await vrm.arrayBuffer()
    const animationFile = new File([await animation.arrayBuffer()], "animation.glb")
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
