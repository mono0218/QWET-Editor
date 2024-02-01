# WebLiveについて

## できること
glb形式のステージおよびモーションデータの投稿

VroidHub上のVRMアバターの利用

BabylonjsとSongleAPIを使用した全クライアント同時再生ライブ

> [!IMPORTANT]
> ライブはWebXRにも対応しておりVRゴーグル（MetaQuest・Pico4)などから見ることができます
> 是非XR対応VRゴーグルでもお試しください！！！！！！
> 詳しくは遊び方をご覧ください

## 遊び方
[こちらのMDをご覧ください！](https://github.com/mono0218/WebLive-Hub/blob/main/docs/HowtoUse.md)

## GLBアセットについての仕様
ステージデータおよびモーションデータはGLB形式であること、またモーションデータに関しては以下の変換形式に当てはまるもののみ使用出来ます

> [!CAUTION]
> MMDモデルをコンバートして作られた各アセットに関しては投稿禁止とさせていただきます。（製作者本人が投稿する場合を除く

```js
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
```

## VRMアセットについての仕様
Vroid Hubに投稿されているVRMをAPIからロードしています。
> [!IMPORTANT]
> VRMのロードに関しては、VroidHubAPIの仕様上
> vroidhubでいいねしたモデルで特定の条件に当てはまらないもののみが表示されます。

条件は以下の通りです.

![image](https://github.com/mono0218/WebLive-Hub/assets/81796635/da47e39c-b2ec-4a29-9b0a-7dafab78b313)


> [!WARNING]
> VRMに関しては座標系の問題から1.0のみ使用出来ます。
> （VRM０.0の読み込みはできますが、テクスチャなどに問題が起きる可能性があるので推奨されません
> 
> 推奨する1.0モデルの[リンク](https://hub.vroid.com/characters/7776895741501169062/models/8677986118911130278)




