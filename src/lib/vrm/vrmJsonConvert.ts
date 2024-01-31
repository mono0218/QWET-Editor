import {WebIO} from '@gltf-transform/core';

export class vrmJsonConvert {
    io: WebIO;

    constructor() {
        this.io = new WebIO({credentials: 'include'});
    }

    async coordinateConvert(file: ArrayBuffer) {
        const binary = new Uint8Array(file);

        const document = await this.io.readBinary(binary);
        document.getRoot().listNodes().map(node => {
            node.setTranslation([node.getTranslation()[0] * -1, node.getTranslation()[1], node.getTranslation()[2] * -1])
        })

        const glb = await this.io.writeBinary(document);
        return new File([glb], "vrm.vrm");
    }
}
