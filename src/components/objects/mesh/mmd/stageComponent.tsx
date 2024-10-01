import 'babylon-mmd/esm/Loader/Optimized/bpmxLoader'
import { MeshComponent } from '@/components/objects/mesh/meshComponent'

export class StageComponent extends MeshComponent {
    constructor(file: File) {
        super(null, file)
    }
}
