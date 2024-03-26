import { GLTFFileLoader } from '@babylonjs/loaders'

export class VRMFileLoader extends GLTFFileLoader {
    public name = 'vrm'
    public extensions = {
        '.vrm': { isBinary: true },
    }

    public createPlugin() {
        return new VRMFileLoader()
    }
}
