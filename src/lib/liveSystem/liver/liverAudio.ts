export class LiverAudio{
    ctx:AudioContext
    source:AudioBufferSourceNode
    stream:MediaStream

    async init(){
        this.ctx = new AudioContext();
        this.source = this.ctx.createBufferSource();
        const mediaStreamDest = this.ctx.createMediaStreamDestination();
        this.source.connect(mediaStreamDest);
        const {stream} = mediaStreamDest

        const res = await fetch(new URL("/public/aipai.mp3", import.meta.url).href);
        this.source.buffer = await this.ctx.decodeAudioData(await res.arrayBuffer());

        return stream
    }

    async play(){
        this.source.start(0)
    }
}
