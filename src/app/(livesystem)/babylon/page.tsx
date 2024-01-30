import MMD, {liveProps} from "@/app/(livesystem)/babylon/components/MMD";

export default function Home(): JSX.Element  {
    const liveData:liveProps ={
        uuid: "aa",
        modelUrl: "/0.0.vrm",
        motionUrl: "/aipai.glb",
        stageUrl: "/CyberStage_AB.glb",
        movieUrl: "https://www.youtube.com/watch?v=bnofYmfKLeo",
        accessToken: "0000011a-YcMiX6M",
        secretToken: "",
    }
    return (
        <MMD {...liveData}/>
    )
}
