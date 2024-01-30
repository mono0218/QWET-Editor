import LiveComponent, {liveProps} from "@/app/(livesystem)/room/[id]/liveComponent";
import {roomDB} from "@/lib/room/roomDB";
import {MotionStorage} from "@/lib/motion/motionStorage";
import {StageStorage} from "@/lib/stage/stageStorage";

export default async function Home({params}: { params: { id: string } }): Promise<JSX.Element> {
    const roomdb = new roomDB()
    const result = await roomdb.Get({uuid: params.id})

    if (result == null) {
        return (<div>ルームが見つかりません</div>)
    }

    const motionStorage = new MotionStorage()
    const stageStorage = new StageStorage()

    const motionUrl = await motionStorage.get({uuid: result.motionUUID})
    const stageUrl = await stageStorage.get({uuid: result.stageUUID})

    const liveData: liveProps = {
        uuid: result.uuid,
        modelUrl: result.avatarUrl,
        motionUrl: motionUrl,
        stageUrl: stageUrl,
        movieUrl: result.movieUrl,
        accessToken: result.userKey,
        secretToken: result.masterKey,
    }
    return (
        <LiveComponent {...liveData}/>
    )
}
