import { QwetObject } from '@/types/object'
import { Mesh, MeshBuilder, SceneLoader, ShaderMaterial, TransformNode, Vector3 } from '@babylonjs/core'
import "@babylonjs/loaders/glTF"
import { QwetComponent } from '@/types/component'
import React from 'react'
import { QwetUiComponent } from '@/types/uiComponent'
import {Inspector} from "@babylonjs/inspector"

export class VolumetricLight implements QwetComponent {
    light: Mesh | undefined
    beam: Mesh | undefined
    shaderMaterial: ShaderMaterial | undefined
    object: QwetObject | undefined
    uiComponentList: Array<QwetUiComponent> = []
    arm: Mesh | undefined
    lightArm: TransformNode | undefined
    lightMesh: Mesh | undefined

    constructor() {
    }

    init(){
        if  (!this.object) throw new Error('Object is not initialized')
        SceneLoader.ImportMeshAsync("", "", "https://dev.storage-qwet.monodev.cloud/common/beamlight.glb", this.object.scene).then((result) => {
            this.light = result.meshes[0] as Mesh
            result.transformNodes.forEach((node) => {
                if(node.id.includes("Light.001")){
                    this.lightArm = node
                }
            })

            result.meshes.forEach((mesh) => {
                console.log(mesh.id)
                if(mesh.id.includes("Arm")){
                    this.arm = mesh as Mesh
                }else if(mesh.id.includes("Light.001_primitive2")){
                    this.lightMesh = mesh as Mesh
                }
            })

            if  (!this.lightMesh) throw new Error('lightMesh is not initialized')
            const height =  15
            this.beam = MeshBuilder.CreateCylinder("cone", { diameterTop: 0.1, diameterBottom: 5, height: height,}, this.object!.scene);
            this.beam.parent = this.lightMesh
            this.beam.position = new Vector3(0, - height / 2, 0)

            this.light!.scaling = new Vector3(2, 2, 2)
            this.shader()
        })
    }

    shader(){
        this.shaderMaterial = new ShaderMaterial("beamShader", this.object!.scene, {vertexSource: vertexShader, fragmentSource: fragmentShader},
            {
                attributes: ["position", "normal", "uv"],
                uniforms: ["worldViewProjection", "lightColor", "spotPosition", "attenuation", "anglePower" ],
                needAlphaBlending: true,
                needAlphaTesting: true
            }
        );

        this.shaderMaterial.setVector3("lightColor", new Vector3(225 / 225 , 225 / 225, 225 / 225))
        this.shaderMaterial.setVector3("spotPosition", new Vector3(0, - this.beam!.position.y, 0))
        this.shaderMaterial.setFloat("attenuation", 10)
        this.shaderMaterial.setFloat("anglePower", 5)
        Inspector.Show(this.object!.scene, {})
        this.beam!.material = this.shaderMaterial
        this.beam!.material.backFaceCulling = false;
    }
    ui(): React.JSX.Element {
        return <></>
    }

    update(): void {
    }

    destroy(): void {
    }
}

const vertexShader = `
    precision highp float;
    attribute vec3 position;
    attribute vec3 normal;
    uniform mat4 worldViewProjection;
    varying vec3 vPosition;
    varying vec3 vNormal;
    void main()
    {
        vec4 p = vec4(position, 1.);
        vPosition = position;
        vNormal = normal;
        gl_Position = worldViewProjection * p;
    }
`

const fragmentShader = `

    precision highp float;
    // attribute vec3 position;
    // attribute vec3 normal;
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform vec3 lightColor;
    uniform vec3 spotPosition;
    uniform float attenuation;
    uniform float anglePower;
    // gl_FragColor = vec4(1.,0.,0.,1.);
    void main()
    {
        float intensity;
        intensity = distance(vPosition, spotPosition) / attenuation;
        intensity = 1.0 - clamp(intensity, 0.0, 1.0);
        vec3 normal = vec3(vNormal.x, vNormal.y, abs(vNormal.z));
        float angleIntensity = pow(dot(normal, vec3(0.0, 0.0, 1.0)), anglePower);
        intensity = intensity * angleIntensity;
        gl_FragColor = vec4(lightColor, intensity);
    }
`
