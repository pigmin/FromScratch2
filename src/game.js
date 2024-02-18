import { AxesViewer, BoundingInfo, Color3, Color4, DefaultRenderingPipeline, FreeCamera, HemisphericLight, KeyboardEventTypes, MeshBuilder, MotionBlurPostProcess, Scalar, Scene, SceneLoader, Sound, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";

import musicUrl from "../assets/musics/Cyberpunk Moonlight Sonata v2.mp3";

import obstacle1Url from "../assets/models/ice_cube.glb";
import Player from './player';
import { GridMaterial } from '@babylonjs/materials';

class Game {

    engine;
    canvas;
    scene;

    camera;
    light;

    startTimer;

    player;

    inputMap = {};
    actions = {};

    constructor(engine, canvas) {
        this.engine = engine;
        this.canvas = canvas;
    }

    async init() {
        this.engine.displayLoadingUI();
        await this.createScene();

        this.player = new Player(this.scene, this.camera);
        

        this.initKeyboard();

        this.engine.hideLoadingUI();
    }

    initKeyboard() {
        this.scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case KeyboardEventTypes.KEYDOWN:
                    this.inputMap[kbInfo.event.code] = true;
                    //console.log(`KEY DOWN: ${kbInfo.event.code} / ${kbInfo.event.key}`);
                    break;
                case KeyboardEventTypes.KEYUP:
                    this.inputMap[kbInfo.event.code] = false;
                    this.actions[kbInfo.event.code] = true;
                    //console.log(`KEY UP: ${kbInfo.event.code} / ${kbInfo.event.key}`);
                    break;
            }
        });        
    }

    async start() {

        await this.init();

        Inspector.Show(this.scene, {});

        this.startTimer = 0;
        this.engine.runRenderLoop(() => {

                let delta = this.engine.getDeltaTime() / 1000.0;

                this.update(delta);


                //Reset actions
                this.actions = {};
                this.scene.render();
        });
    }

    update(delta) {

        this.player.update(delta, this.inputMap, this.actions);


        this.startTimer += delta;
    }

    async createScene() {

        // This creates a basic Babylon Scene object (non-mesh)
        this.scene = new Scene(this.engine);
        this.scene.clearColor = new Color3(0.4, 0.4, 1);
        this.scene.collisionsEnabled = true;


        // This creates and positions a free camera (non-mesh)
        this.camera = new FreeCamera("camera1", new Vector3(0, 5, -10), this.scene);

        // This targets the camera to scene origin
        this.camera.setTarget(new Vector3(0, 0, 0));

        // This attaches the camera to the canvas
        this.camera.attachControl(this.canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        this.light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);

        // Default intensity is 1. Let's dim the light a small amount
        this.light.intensity = 1.0;

        let ground = MeshBuilder.CreateGround("ground", {width: 32, height: 32}, this.scene);
        ground.material = new GridMaterial("groundMat");

        new AxesViewer(this.scene, 5);

        this.music = new Sound("music", musicUrl, this.scene, undefined, { loop: true, autoplay: false, volume: 0.4 });

    }
}

export default Game;