import {
    AssetsManager,
    Engine,
    FreeCamera,
    HavokPlugin, Mesh, MeshAssetTask,
    Scene,
    SceneLoader,
    Vector3,
    WebXRDefaultExperience,
} from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";
import {GLTFFileLoader} from "@babylonjs/loaders";

class VRMFileLoader extends GLTFFileLoader {
    public name = "vrm";
    public extensions = {
        ".vrm": { isBinary: true },
    };

    public createPlugin() {
        return new VRMFileLoader();
    }
}

export class ListenerLiveScene {
    scene: Scene | undefined;
    engine: Engine | undefined;
    xrEnv: WebXRDefaultExperience | undefined;

    constructor(){
        this.createScene()
        this.enablePhysics()
        this.cameraController()
        this.xrInit().then(
            ()=>{
                this.createObjects().then()
            }
        )


        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    createScene() {
        SceneLoader.RegisterPlugin(new VRMFileLoader());

        let canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // initialize babylon scene and engine
        this.engine = new Engine(canvas, true);

        this.scene = new Scene(this.engine);
    }

    enablePhysics() {
        HavokPhysics().then((havok) => {
            const gravityVector = new Vector3(0, -9.81, 0);
            const physicsPlugin = new HavokPlugin(true, havok);
            this.scene.enablePhysics(gravityVector, physicsPlugin);
        })
    }

    cameraController() {
        this.scene.gravity = new Vector3(0, -0.15, 0);

        let camera = new FreeCamera("camera1", new Vector3(0, 5, -6), this.scene);
        camera.attachControl();

        camera.applyGravity = true;
        camera.checkCollisions = true;

        camera.ellipsoid = new Vector3(0.1, 0.5, 0.1);
        camera.minZ = 0.1;
        camera.speed = 0.1;
        camera.angularSensibility = 4000;

        camera.keysUp.push(87); // W
        camera.keysDown.push(83); // S
        camera.keysLeft.push(65); // A
        camera.keysRight.push(68); // D
        camera.keysUpward.push(32); // Space
        camera.keysDownward.push(16); // Shift
    }

    async createObjects() {
        let avatar = await SceneLoader.ImportMeshAsync(
            "",
            "",
            new URL('/public/1.vrm', import.meta.url).href,
            this.scene,undefined,undefined,"avatar"
        );

        avatar.meshes.map((mesh) => {
            mesh.rotation.y = Math.PI;
        })

        let stage = await SceneLoader.ImportMeshAsync(
            "",
            "",
            new URL('/public/stage.glb', import.meta.url).href,
            this.scene,undefined,undefined,"stage"
        )

        stage.meshes.map((mesh) => {
            mesh.checkCollisions = true;
            this.xrEnv.teleportation.addFloorMesh(mesh);
        })

        let models = {};

        const assetsManager = new AssetsManager(this.scene);
        assetsManager.addMeshTask("load left hand", "", "", new URL('/public/penlight1.glb', import.meta.url).href,);

        assetsManager.onTaskSuccess = ((task: MeshAssetTask) => {
            task.loadedMeshes[1].setEnabled(false);
            task.loadedMeshes.map((mesh) => {
                mesh.setEnabled(false)
            })

            models["penlight"] = task.loadedMeshes
        });

        await assetsManager.loadAsync();

        this.xrEnv.pointerSelection.detach();
        this.xrEnv.input.onControllerAddedObservable.add((webXrInputSource) => {
            if (webXrInputSource.inputSource.handedness === "right") {
                models["penlight"].map((mesh) => {
                    let rightControllerMesh:Mesh = mesh.createInstance("r_penlight");
                    rightControllerMesh.rotation.x = 90
                    rightControllerMesh.scaling = new Vector3(0.02,0.02,0.02)
                    rightControllerMesh.parent = webXrInputSource.grip || webXrInputSource.pointer;
                })
            }

            if (webXrInputSource.inputSource.handedness === "left") {
                models["penlight"].map((mesh) => {
                    let leftControllerMesh:Mesh = mesh.createInstance("leftController");
                    leftControllerMesh.rotation.x = 90
                    leftControllerMesh.scaling = new Vector3(0.02,0.02,0.02)
                    leftControllerMesh.parent = webXrInputSource.grip || webXrInputSource.pointer;
                })
            }
        });
    }

    async xrInit(){
        this.xrEnv = await this.scene.createDefaultXRExperienceAsync({
            inputOptions: {
                doNotLoadControllerMeshes: true
            }

        });
    }

    async getfps(){
        return this.engine.getFps().toFixed()
    }
}
