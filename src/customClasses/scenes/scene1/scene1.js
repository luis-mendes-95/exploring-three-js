import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import cosmoBackground from '../../../assets/backgrounds/cosmo.jpg';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Scene1 {
    constructor(game) {

        /**SCENE SETUP */
        (()=>{
            /** GAME SETUP | GLOBAL MEASURES | LOADERS*/
            (()=>{

                /**GAME CLASS */
                this.game = game;

                /**GLOBAL MEASURES */
                this.speed = 0.01;

                /**LOADERS */
                this.glTFLoader = new GLTFLoader();
                this.mixer;


            })();

            /**CAMERA SETUP*/
            (()=>{
                this.game.camera.position.set(0, 3, 3);
            })();

            /**BACKGROUND RENDERING*/
            (()=>{
                this.textureLoader = new THREE.TextureLoader();
                this.cubeTextureLoader = new THREE.CubeTextureLoader();
                const urls = [
                    cosmoBackground,
                    cosmoBackground,
                    cosmoBackground,
                    cosmoBackground,
                    cosmoBackground,
                    cosmoBackground
                ];
                const cubeTexture = this.cubeTextureLoader.load(urls, () => {
                    this.game.scene.background = cubeTexture;
                });
            })();

            /**LIGHTNING */
            (()=>{
            
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
            (()=>{
                this.fog = new THREE.FogExp2("lightgray", 0.03);
                this.game.scene.fog = this.fog;
            })();

            /** GUI | SETUP AND ADDING CONTROLS*/
            (()=>{

                /**INSTANCE AND OPTIONS SETUP */
                this.gui = new dat.GUI({ autoPlace: false });
                this.options = {

        
                    groundColor: '#ff00ff',
                    wireframe: false,
                    speed: 0.1,
                    OrbitControls: false,
        
                };

                document.body.appendChild(this.gui.domElement);

                /** GUI CONTROLS ADDING */
                (()=>{
                   
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
                  
                })();
            })();

            /**SCENE ELEMENTS */
            (()=>{

                /** GROUND */
                (()=>{
                    this.ground = new THREE.Mesh(
                        new THREE.BoxGeometry(50, 0.1, 50),
                        new THREE.MeshStandardMaterial({ 
                            color: "#aaaaaaaa",
                            side: THREE.DoubleSide
                        })
                    );
                    this.ground.position.set(0, 0, 0);
                    this.ground.receiveShadow = true;
                    this.game.scene.add(this.ground);
                })();

                /**CHARACTERS*/
                (()=>{

                    /**MEGAN -> GLTF*/
                    (()=>{
                        const meganUrl = new URL('../../../assets/characters/megan/Megan.glb', import.meta.url);
                        this.glTFLoader.load(meganUrl.href, (gltf) => {
                            this.megan = gltf.scene;
                            this.megan.traverse((child) => {
                                if (child.isMesh) {
                                    child.castShadow = true;
                                    //child.receiveShadow = true;
                                }
                            });
                            this.megan.position.set(0, 0.045, 0);
                            this.game.scene.add(this.megan);
                            this.mixer = new THREE.AnimationMixer(this.megan);
                            this.meganAnimations = gltf.animations;
                            this.meganIdle = THREE.AnimationClip.findByName(this.meganAnimations, 'IDLE');
                            this.animateAction = this.mixer.clipAction(this.meganIdle);
                            this.animateAction.play();
                        
                            
                        }, undefined, (error) => {console.error(error)});
                    })();



                })();

            })();

            /** HELPERS -> AXES / GRID / LIGHTNING*/
            (()=>{
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
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
    }

    /**TO USE IN ELEMENTS IN SCENE -> ANIMATION BOUNCING */
    bounceUpAndDown(element) {

        if(element){
            element.position.y += Math.sin(this.game.clock.getElapsedTime() * 2) * this.speed;
            element.rotation.y += Math.sin(this.game.clock.getElapsedTime() * 2) * this.speed;
        }
    }

}