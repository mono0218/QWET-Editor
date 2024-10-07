import { QwetComponent } from '@/types/component'
import React from 'react'
import { QwetUiComponent } from '@/types/uiComponent'
import { QwetObject } from '@/types/object'
import { Color4, ParticleSystem, Vector3 } from '@babylonjs/core'
import { BpmxObject } from 'babylon-mmd'
import Texture = BpmxObject.Texture

export class EffectComponent implements QwetComponent {
    object: QwetObject | undefined
    uiComponentList: Array<QwetUiComponent> = []
    particleSystem: ParticleSystem | undefined

    constructor() {
    }

    init(): void {
        this.particleSystem = new ParticleSystem("particles", 2000, this.object!.scene);

        //Texture of each particle
        this.particleSystem.particleTexture = new Texture("textures/flare.png", this.object!.scene);

        this.particleSystem.minEmitBox = new Vector3(-1, -1, -1); // Bottom Left Front
        this.particleSystem.maxEmitBox = new Vector3(1, 1, 1); // Top Right Back

        // Colors of all particles
        this.particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
        this.particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
        this. particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0);

        // Size of each particle (random between...
        this.particleSystem.minSize = 0.1;
        this.particleSystem.maxSize = 0.5;

        // Life time of each particle (random between...
        this.particleSystem.minLifeTime = 0.3;
        this.particleSystem.maxLifeTime = 1.5;

        // Emission rate
        this.particleSystem.emitRate = 1500;

        this.particleSystem.gravity = new Vector3(0, -9.81, 0);

        this.particleSystem.direction1 = new Vector3(-7, 8, 3);
        this.particleSystem.direction2 = new Vector3(7, 8, -3);
        this.particleSystem.minAngularSpeed = 0;
        this.particleSystem.maxAngularSpeed = Math.PI;
        this.particleSystem.minEmitPower = 1;
        this.particleSystem.maxEmitPower = 3;
        this.particleSystem.updateSpeed = 0.005;
    }

    startParticle(x: number, y: number, z: number ) {
        if (!this.particleSystem) return;
        this.particleSystem.emitter = new Vector3(x, y, z);
        this.particleSystem.start();
    }

    stopParticle() {
        if (!this.particleSystem) return;
        this.particleSystem.stop();
    }



    ui(): React.JSX.Element {
        return <>EffectComponent</>
    }

    update(): void {
    }

    destroy(): void {
    }
}
