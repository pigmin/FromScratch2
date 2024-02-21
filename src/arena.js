import { MeshBuilder, SceneLoader, Vector3 } from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials';


import arenaLevel1Url from "../assets/models/arena_level1.glb";
import { GlobalManager } from './globalmanager';

class Arena {

    mesh;

    playerSpawnPoint;

    constructor() {
    }

    async init() {
        /*this.mesh = MeshBuilder.CreateGround("ground", {width: 32, height: 32}, GlobalManager.scene);*/

        const result = await SceneLoader.ImportMeshAsync("", "", arenaLevel1Url, GlobalManager.scene);
//console.log(result);

        for (let aNode of result.transformNodes) {
            if (aNode.name.includes("SPAWN_P")) {
                //Player start 
                aNode.computeWorldMatrix(true);
                this.playerSpawnPoint = aNode.getAbsolutePosition();
                aNode.dispose();
            }
        }

        for (let childMesh of result.meshes) {

            if (childMesh.metadata && childMesh.metadata.gltf && childMesh.metadata.gltf.extras)
            {
                let extras = childMesh.metadata.gltf.extras;
                //Recup les datas supp.
    
                    console.log(extras);
            }
                


            if (childMesh.getTotalVertices() > 0) {
                //Objet 3D
                childMesh.receiveShadows = true;
                GlobalManager.addShadowCaster(childMesh);
            }
            else {
                
            }

        }


    }

    getSpawnPoint(playerIndex) {
        return this.playerSpawnPoint.clone();
    }

    update() {

    }

}

export default Arena;