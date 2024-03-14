import {GLTFFileLoader} from "@babylonjs/loaders";
import {Engine, FreeCamera, Scene, SceneLoader, SceneLoaderAnimationGroupLoadingMode, Vector3} from "@babylonjs/core";
import {liverSendRtc} from "./sendLiver.ts";

class VRMFileLoader extends GLTFFileLoader {
    public name = "vrm";
    public extensions = {
        ".vrm": { isBinary: true },
    };

    public createPlugin() {
        return new VRMFileLoader();
    }
}

export class LiveScene {
    scene: Scene;
    engine:Engine;
    SendRtc: liverSendRtc;

    constructor(sendRtc:liverSendRtc){
        this.createScene()
        this.cameraController()
        this.SendRtc = sendRtc
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    createScene() {
        let canvas = document.createElement("canvas");
        canvas.style.width = "10%";
        canvas.style.height = "10%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // initialize babylon scene and engine
        this.engine = new Engine(canvas, true);
        SceneLoader.RegisterPlugin(new VRMFileLoader());

        this.scene = new Scene(this.engine);
    }

    cameraController() {
        this.scene.gravity = new Vector3(0, -0.15, 0);

        let camera = new FreeCamera("camera1", new Vector3(0, 0, -3), this.scene);
        camera.attachControl();

        camera.applyGravity = true;
        camera.checkCollisions = true;
    }

    async createObjects(motion:File) {
        const loaded =  await SceneLoader.ImportMeshAsync(
            "",
            "",
            new URL("/public/1.vrm", import.meta.url).href,
            this.scene,
            undefined,
            undefined,
        ).then((data)=> {
            data.meshes[0].name = "motion"
            SceneLoader.ImportAnimationsAsync(
                "",
                motion,
                this.scene,
                true,
                SceneLoaderAnimationGroupLoadingMode.NoSync,
                (oldTarget) => {
                    let target = oldTarget;
                    for (const node of data.transformNodes) {
                        const afterId = convertNameJson[node.id];
                        if (afterId != undefined) {
                            if (target.id === afterId) {
                                target = node;
                                break;
                            }
                        }
                    }
                    return target;
                },
                function (data) {
                    data.animationGroups;
                },
            );
        })
    }

    async loopSendPosition(){
        setInterval(()=>{
            let json:any[] = []

            this.scene.getMeshByName("motion").getChildTransformNodes().map((node)=>{
                if(node.rotationQuaternion && node.position) {
                    json.push( {
                        name:node.name,
                        x:node.position.x,y:node.position.y,z:node.position.z,
                        qx:node.rotationQuaternion.x, qy:node.rotationQuaternion.y,qz:node.rotationQuaternion.z,qw:node.rotationQuaternion.w
                    })
                }
            })

            this.SendRtc.sendProducerData(JSON.stringify(json))
        },10)
    }
}

const convertNameJson = {
    J_Bip_C_Chest: "Spine1",
    J_Bip_C_Head: "Head",
    J_Bip_C_Hips: "Hips",
    J_Bip_C_Neck: "Neck",
    J_Bip_C_Spine: "Spine",
    J_Bip_C_UpperChest: "Spine2",
    J_Bip_L_Foot: "LeftFoot",
    J_Bip_L_Hand: "LeftHand",
    J_Bip_L_Index1: "LeftHandIndex1",
    J_Bip_L_Index2: "LeftHandIndex2",
    J_Bip_L_Index3: "LeftHandIndex3",
    J_Bip_L_Little1: "LeftHandPinky1",
    J_Bip_L_Little2: "LeftHandPinky2",
    J_Bip_L_Little3: "LeftHandPinky3",
    J_Bip_L_LowerArm: "LeftForeArm",
    J_Bip_L_LowerLeg: "LeftLeg",
    J_Bip_L_Middle1: "LeftHandMiddle1",
    J_Bip_L_Middle2: "LeftHandMiddle2",
    J_Bip_L_Middle3: "LeftHandMiddle3",
    J_Bip_L_Ring1: "LeftHandRing1",
    J_Bip_L_Ring2: "LeftHandRing2",
    J_Bip_L_Ring3: "LeftHandRing3",
    J_Bip_L_Shoulder: "LeftShoulder",
    J_Bip_L_Thumb1: "LeftHandThumb1",
    J_Bip_L_Thumb2: "LeftHandThumb2",
    J_Bip_L_Thumb3: "LeftHandThumb3",
    J_Bip_L_ToeBase: "LeftToeBase",
    J_Bip_L_UpperArm: "LeftArm",
    J_Bip_L_UpperLeg: "LeftUpLeg",
    J_Bip_R_Foot: "RightFoot",
    J_Bip_R_Hand: "RightHand",
    J_Bip_R_Index1: "RightHandIndex1",
    J_Bip_R_Index2: "RightHandIndex2",
    J_Bip_R_Index3: "RightHandIndex3",
    J_Bip_R_Little1: "RightHandPinky1",
    J_Bip_R_Little2: "RightHandPinky2",
    J_Bip_R_Little3: "RightHandPinky3",
    J_Bip_R_LowerArm: "RightForeArm",
    J_Bip_R_LowerLeg: "RightLeg",
    J_Bip_R_Middle1: "RightHandMiddle1",
    J_Bip_R_Middle2: "RightHandMiddle2",
    J_Bip_R_Middle3: "RightHandMiddle3",
    J_Bip_R_Ring1: "RightHandRing1",
    J_Bip_R_Ring2: "RightHandRing2",
    J_Bip_R_Ring3: "RightHandRing3",
    J_Bip_R_Shoulder: "RightShoulder",
    J_Bip_R_Thumb1: "RightHandThumb1",
    J_Bip_R_Thumb2: "RightHandThumb2",
    J_Bip_R_Thumb3: "RightHandThumb3",
    J_Bip_R_ToeBase: "RightToeBase",
    J_Bip_R_UpperArm: "RightArm",
    J_Bip_R_UpperLeg: "RightUpLeg",
};
