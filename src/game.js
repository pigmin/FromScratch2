import { Color3, Color4, CubeTexture, DirectionalLight, FreeCamera, HemisphericLight, KeyboardEventTypes, Scene, ShadowGenerator, Sound, Vector3 } from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";

import musicUrl from "../assets/musics/Cyberpunk Moonlight Sonata v2.mp3";

import Player from './player';
import Arena from './arena';
import { GlobalManager } from './globalmanager';

import envSpecularUrl from "../assets/env/environmentSpecular.env";

class Game {

    engine;
    canvas;
    scene;

    camera;
    light;

    startTimer;

    player;
    arena;

    inputMap = {};
    actions = {};

    bInspector = false;

    constructor(engine, canvas) {
        GlobalManager.engine = engine;
        GlobalManager.canvas = canvas;
    }

    async init() {
        GlobalManager.engine.displayLoadingUI();
        await this.createScene();

        this.arena = new Arena();
        await this.arena.init();

        this.player = new Player(this.arena.getSpawnPoint());
        await this.player.init();

        this.initKeyboard();

        GlobalManager.engine.hideLoadingUI();
    }

    initKeyboard() {
        GlobalManager.scene.onKeyboardObservable.add((kbInfo) => {
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

        
        this.startTimer = 0;
        GlobalManager.engine.runRenderLoop(() => {

                GlobalManager.update();
                

                this.update();


                if (this.actions["KeyI"]) {
                    if (this.bInspector) {
                        Inspector.Hide();
                    }
                    else {
                        Inspector.Show(GlobalManager.scene, {});
                    }
                    this.bInspector = !this.bInspector;
                }
                //Reset actions
                this.actions = {};
                GlobalManager.scene.render();
        });
    }

    update(delta) {

        this.arena.update();

        this.player.update(this.inputMap, this.actions);


        this.startTimer += delta;
    }

    async createScene() {

        // This creates a basic Babylon Scene object (non-mesh)
        GlobalManager.scene = new Scene(GlobalManager.engine);
        GlobalManager.scene.clearColor = new Color3(0.4, 0.4, 1);
        GlobalManager.scene.collisionsEnabled = true;


        // This creates and positions a free camera (non-mesh)
        GlobalManager.camera = new FreeCamera("camera1", new Vector3(0, 5, -10), GlobalManager.scene);

        // This targets the camera to scene origin
        GlobalManager.camera.setTarget(new Vector3(0, 0, 0));

        // This attaches the camera to the canvas
        GlobalManager.camera.attachControl(GlobalManager.canvas, true);

        let envOptions = {
            createGround: false,
            createSkybox : false,
            cameraExposure : 0.4,
            environmentTexture : new CubeTexture(envSpecularUrl, GlobalManager.scene),
        };
        GlobalManager.scene.createDefaultEnvironment(envOptions);
        GlobalManager.scene.environmentIntensity = 0.35;
        
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        let light = new DirectionalLight("light", new Vector3(1, 10, 0), GlobalManager.scene);
        light.direction = new Vector3(0.45, -0.47, -0.76);
        light.diffuse = Color3.FromHexString("#703B19");
        light.autoCalcShadowZBounds = true;
        light.autoUpdateExtends = true;

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 1.0;
        GlobalManager.addLight(light);

        let shadowGen = new ShadowGenerator(1024, light);
        shadowGen.useBlurCloseExponentialShadowMap = true;
        GlobalManager.addShadowGenerator(shadowGen);

        //new AxesViewer(GlobalManager.scene, 5);

        //TODO : move to sound manager
        this.music = new Sound("music", musicUrl, GlobalManager.scene, undefined, { loop: true, autoplay: false, volume: 0.4 });

    }
}

export default Game;