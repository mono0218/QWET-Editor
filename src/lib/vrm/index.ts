import {
  SceneLoader,
  SceneLoaderAnimationGroupLoadingMode,
} from "@babylonjs/core/Loading/sceneLoader";
import { Scene, Vector3 } from "@babylonjs/core";

export async function ImportVRM(name: string, vrm: File, scene: Scene) {
  await SceneLoader.ImportMeshAsync(name, "", vrm, scene);
}

export async function getJson(file: ArrayBuffer) {
  const LE = true; // Binary GLTF is little endian.
  const GLB_FILE_HEADER_SIZE = 12;
  const GLB_CHUNK_LENGTH_SIZE = 4;
  const GLB_CHUNK_TYPE_SIZE = 4;
  const GLB_CHUNK_HEADER_SIZE = GLB_CHUNK_LENGTH_SIZE + GLB_CHUNK_TYPE_SIZE;
  const offset = GLB_FILE_HEADER_SIZE;

  const dataView = new DataView(file);

  const chunkLength = dataView.getUint32(offset, LE);
  const jsonChunk = new Uint8Array(
    dataView.buffer,
    offset + GLB_CHUNK_HEADER_SIZE,
    chunkLength,
  );
  const decoder = new TextDecoder("utf8");

  const jsonText = decoder.decode(jsonChunk);
  const json = JSON.parse(jsonText);

  const result = { json: json, length: chunkLength };

  return result;
}

export async function ImportWithAnimation(
  name: string,
  vrm: File,
  animation: File,
  scene: Scene,
) {
  const loaded = await SceneLoader.ImportMeshAsync(
    "",
    "",
    vrm,
    scene,
    undefined,
    undefined,
    name,
  );
  await SceneLoader.ImportAnimationsAsync(
    "",
    animation,
    scene,
    true,
    SceneLoaderAnimationGroupLoadingMode.NoSync,
    (oldTarget) => {
      let target = oldTarget;
      for (const node of loaded.transformNodes) {
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
    function () {
      loaded.animationGroups;
    },
  );

  loaded.meshes.map((mesh) => {
    mesh.rotation = new Vector3(0, 180, 0);
  });
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
