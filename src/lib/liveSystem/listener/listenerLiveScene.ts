import {
    AssetsManager,
    Engine,
    FreeCamera,
    HavokPlugin,
    InstancedMesh,
    Mesh,
    MeshAssetTask, MeshBuilder,
    Scene,
    SceneLoader, ShaderMaterial,
    Vector3,
    WebXRDefaultExperience,
} from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";
import {GLTFFileLoader} from "@babylonjs/loaders";

class VRMFileLoader extends GLTFFileLoader {
    public name = "vrm";
    public extensions = {
        ".vrm": {isBinary: true},
    };

    public createPlugin() {
        return new VRMFileLoader();
    }
}

export class ListenerLiveScene {
    scene: Scene | undefined;
    engine: Engine | undefined;
    xrEnv: WebXRDefaultExperience | undefined;

    async init() {
        this.createScene()
        this.cameraController()
        await this.enablePhysics()
        await this.xrInit()
        await this.LoadLightShader()
        await this.createObjects()




        if (!this.engine) return
        this.engine.runRenderLoop(() => {
            if (!this.scene) return
            this.scene.render();
        });
    }

    createScene() {
        SceneLoader.RegisterPlugin(new VRMFileLoader());

        const canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // initialize babylon scene and engine
        this.engine = new Engine(canvas, true);

        this.scene = new Scene(this.engine);
    }


    cameraController() {
        if (!this.scene) return;

        this.scene.gravity = new Vector3(0, -0.15, 0);

        const camera = new FreeCamera("camera1", new Vector3(0, 5, -6), this.scene);
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
        const avatar = await SceneLoader.ImportMeshAsync(
            "",
            "",
            new URL('/public/1.vrm', import.meta.url).href,
            this.scene, undefined, undefined, "avatar"
        );

        avatar.meshes.map((mesh) => {
            mesh.rotation.y = Math.PI;
            mesh.checkCollisions = true;
            mesh.name = "avatar";
        })

        const stage = await SceneLoader.ImportMeshAsync(
            "",
            "",
            new URL('/public/stage.glb', import.meta.url).href,
            this.scene, undefined, undefined, "stage"
        )

        stage.meshes.map((mesh) => {
            if (!this.xrEnv) return
            mesh.checkCollisions = true;
            mesh.name = "stage";
            this.xrEnv.teleportation.addFloorMesh(mesh);
        })
    }


    async xrInit() {
        if (!this.scene) return;

        this.xrEnv = await this.scene.createDefaultXRExperienceAsync({
            inputOptions: {
                doNotLoadControllerMeshes: true
            }
        });
        await this.loadPenlight()
    }


    async loadPenlight() {
        if (!this.scene || !this.xrEnv) return;

        let models: Array<Mesh>

        const assetsManager = new AssetsManager(this.scene);
        assetsManager.addMeshTask("load left hand", "", "", new URL('/public/penlight1.glb', import.meta.url).href,);

        assetsManager.onTaskSuccess = ((task: MeshAssetTask) => {
            task.loadedMeshes[1].setEnabled(false);
            task.loadedMeshes.map((mesh) => {
                mesh.setEnabled(false)
            })

            models = task.loadedMeshes
        });

        await assetsManager.loadAsync();

        this.xrEnv.pointerSelection.detach();
        this.xrEnv.input.onControllerAddedObservable.add((webXrInputSource) => {
            if (webXrInputSource.inputSource.handedness === "right") {
                models.map((mesh:Mesh) => {
                    const rightControllerMesh:InstancedMesh = mesh.createInstance("r_penlight");
                    rightControllerMesh.rotation.x = 90
                    rightControllerMesh.scaling = new Vector3(0.02,0.02,0.02)
                    rightControllerMesh.parent = webXrInputSource.grip || webXrInputSource.pointer;
                })
            }

            if (webXrInputSource.inputSource.handedness === "left") {
                models.map((mesh:Mesh) => {
                    const leftControllerMesh:InstancedMesh= mesh.createInstance("leftController");
                    leftControllerMesh.rotation.x = 90
                    leftControllerMesh.scaling = new Vector3(0.02,0.02,0.02)
                    leftControllerMesh.parent = webXrInputSource.grip || webXrInputSource.pointer;
                })
            }
        });
    }


    async enablePhysics() {
        if (!this.scene) return;
        const havok = await HavokPhysics({
            locateFile: () => new URL('/public/HavokPhysics.wasm', import.meta.url).href
        })
        const gravityVector = new Vector3(0, -9.81, 0);
        const physicsPlugin = new HavokPlugin(true, havok);
        this.scene.enablePhysics(gravityVector, physicsPlugin);
    }

    async LoadLightShader() {
        let beam1 = MeshBuilder.CreateCylinder("beam1", {height:5,diameterTop: 0.5,diameterBottom:0.3,subdivisions:0,updatable:true});
        let beam2 = MeshBuilder.CreateCylinder("beam2", {height:5,diameterTop: 0.5,diameterBottom:0.3,subdivisions:0,updatable:true});
        beam1.setPivotPoint(new Vector3(0, -2.5, 0));
        beam2.setPivotPoint(new Vector3(0, -2.5, 0));
        beam1.position = new Vector3(-2.6, 2, -2.2);
        beam2.position = new Vector3(2.6, 2, -2.2);
        beam1.rotation = new Vector3(0, -120, -Math.PI / 4);
        beam2.rotation = new Vector3(0, 120, Math.PI / 4);


        const myShaderMaterial = new ShaderMaterial("beamshader", this.scene, "/beam",
            {
                attributes: ["position", "normal", "uv"],
                uniforms: ["worldViewProjection", "lightColor", "spotPosition", "attenuation", "anglePower" ],
                needAlphaBlending: true,
                needAlphaTesting: true
            });

        myShaderMaterial.setVector3("lightColor", new Vector3(225 / 225 , 225 / 225, 225 / 225))
        myShaderMaterial.setVector3("spotPosition", new Vector3(0, 0, 0))
        myShaderMaterial.setFloat("attenuation", 2)
        myShaderMaterial.setFloat("anglePower", 0)

        beam1.material = myShaderMaterial
        beam2.material = myShaderMaterial
    }
}
