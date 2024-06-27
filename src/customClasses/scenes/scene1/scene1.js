import * as THREE from 'three';
import * as dat from 'dat.gui';
import cosmoBackground from '../../../assets/backgrounds/cosmo.jpg';
import { Character } from '../../../engine/character/character.js';

export class Scene1 {
    constructor(game) {
        /**SCENE SETUP */
        (() => {
            /** GAME SETUP | GLOBAL MEASURES | LOADERS*/
            (() => {
                /**GAME CLASS */
                this.game = game;

                /**GLOBAL MEASURES */
                this.speed = 0.01;

            })();

            /**BACKGROUND RENDERING*/
            (() => {

                this.textureLoader = new THREE.TextureLoader();
                this.cubeTextureLoader = new THREE.CubeTextureLoader();
                const urls = [ cosmoBackground, cosmoBackground, cosmoBackground, cosmoBackground, cosmoBackground, cosmoBackground ];
                const cubeTexture = this.cubeTextureLoader.load(urls, () => { this.game.scene.background = cubeTexture; });

            })();

            /**LIGHTNING */
            (() => {
                /**AMBIENT*/
                this.ambientLight = new THREE.AmbientLight("white", 0.05);
                this.game.scene.add(this.ambientLight);

                /**DIRECTIONAL*/
                this.directionalLight = new THREE.DirectionalLight("white", 1);
                this.directionalLight.position.set(4, 8, 0);
                this.directionalLight.castShadow = true;
                this.game.scene.add(this.directionalLight);

                /**SPOT*/
                this.spotLight = new THREE.SpotLight("white", 7, 100, Math.PI / 4, 0.5, 2);
                this.spotLight.position.set(0, 3, 0);
                this.spotLight.castShadow = true;
                this.game.scene.add(this.spotLight);
            })();

            /**FOG */
            (() => {
                this.fog = new THREE.FogExp2("lightgray", 0.03);
                this.game.scene.fog = this.fog;
            })();

            /** GUI | SETUP AND ADDING CONTROLS*/
            (() => {
                /**INSTANCE AND OPTIONS SETUP */
                this.gui = new dat.GUI({ autoPlace: false });
                this.options = {
                    groundColor: '#aaaaaa',
                    wireframe: false,
                    speed: 0.1,
                    OrbitControls: false,
                    cameraRotationX: 0,
                    cameraRotationY: 0,
                    cameraRotationZ: 0,
                    cameraPositionX: 0,
                    cameraPositionY: 0,
                    cameraPositionZ: 0,
                };

                //document.body.appendChild(this.gui.domElement);

                /** GUI CONTROLS ADDING */
                (() => {
                    this.gui.addColor(this.options, 'groundColor').name('Ground Color').onChange((color) => {
                        this.ground.material.color.set(color);
                    });
                    this.gui.add(this.options, 'OrbitControls').name('OrbitControls').onChange((value) => {
                        if (value) {
                            this.controls = new OrbitControls(this.game.camera, this.game.renderer.domElement);
                            this.controls.enableDamping = true;
                            this.controls.dampingFactor = 0.25;
                            this.controls.enableZoom = true;
                            this.controls.autoRotate = true;
                            this.controls.autoRotateSpeed = 1;
                        } else {
                            this.controls.autoRotate = false;
                            this.controls.dispose();
                        }
                    });
                    this.gui.add(this.options, 'cameraRotationX').name('Camera Rotation X').onChange((value) => {
                        this.game.camera.rotation.x = value;
                    });
                    this.gui.add(this.options, 'cameraRotationY').name('Camera Rotation Y').onChange((value) => {
                        this.game.camera.rotation.y = value;
                    });
                    this.gui.add(this.options, 'cameraRotationZ').name('Camera Rotation Z').onChange((value) => {
                        this.game.camera.rotation.z = value;
                    });
                    this.gui.add(this.options, 'cameraPositionX').name('Camera Position X').onChange((value) => {
                        this.game.camera.position.x = value;
                    });
                    this.gui.add(this.options, 'cameraPositionY').name('Camera Position Y').onChange((value) => {
                        this.game.camera.position.y = value;
                    });
                    this.gui.add(this.options, 'cameraPositionZ').name('Camera Position Z').onChange((value) => {
                        this.game.camera.position.z = value;
                    });
                })();
            })();

            /**SCENE ELEMENTS */
            (() => {
                /** GROUND */
                (() => {
                    this.ground = new THREE.Mesh(
                        new THREE.BoxGeometry(10, 0.05, 10),
                        new THREE.MeshStandardMaterial({
                            color: "#aaaaaaaa",
                            side: THREE.DoubleSide
                        })
                    );
                    this.ground.position.set(0, 0, 0);
                    this.ground.receiveShadow = true;
                    this.game.scene.add(this.ground);
                })();

                /**CHARACTERS */
                (()=>{
                    /**MEGAN*/
                    this.megan = new Character(this.game, '../../assets/characters/megan/Megan.glb', 5);
                })();

            })();

            /** HELPERS -> AXES / GRID / LIGHTNING*/
            (() => {
                this.axesHelper = new THREE.AxesHelper(2);
                this.gridHelper = new THREE.GridHelper(10, 10);
                this.dLightHelper = new THREE.DirectionalLightHelper(this.directionalLight, 1);
                this.dLightShadowHelper = new THREE.CameraHelper(this.directionalLight.shadow.camera);
                this.sLightHelper = new THREE.SpotLightHelper(this.spotLight);

                //this.game.scene.add(this.sLightHelper);
                //this.game.scene.add(this.dLightHelper);
            })();
            
        })();
    }

    update(deltaTime) {

        this.megan.update(deltaTime);
        

    }

    /**TO USE IN ELEMENTS IN SCENE -> ANIMATION BOUNCING */
    bounceUpAndDown(element) {
        if (element) {
            element.position.y += Math.sin(this.game.clock.getElapsedTime() * 2) * this.speed;
            element.rotation.y += Math.sin(this.game.clock.getElapsedTime() * 2) * this.speed;
        }
    }


    
}
