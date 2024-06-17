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
                    sphereColor: '#ffea00',
                    sphereX: -1,
                    sphereY: 0.5,
                    sphereZ: 0,
        
                    cubeColor: '#00ff00',
                    cubeX: 0.5,
                    cubeY: 1,
                    cubeZ: 0.5,
        
                    groundColor: '#ff00ff',
                    wireframe: false,
                    speed: 0.1,
                    OrbitControls: false,
        
                    SpotLightX: 0,
                    SpotLightY: 3,
                    SpotLightZ: 0
                };

                document.body.appendChild(this.gui.domElement);

                /** GUI CONTROLS ADDING */
                (()=>{
                    this.gui.addColor(this.options, 'sphereColor').name('Sphere Color').onChange((color) => {
                        this.sphere.material.color.set(color);
                    });
                    this.gui.addColor(this.options, 'cubeColor').name('Cube Color').onChange((color) => {
                        this.cube.material.color.set(color);
                    });
                    this.gui.addColor(this.options, 'groundColor').name('Ground Color').onChange((color) => {
                        this.ground.material.color.set(color);
                    });
                    this.gui.add(this.options, 'wireframe').name('Wireframe').onChange((wireframe) => {
                        this.sphere.material.wireframe = wireframe;
                    });
                    this.gui.add(this.options, 'speed', 0.01, 0.05).name('Speed').onChange((value) => {
                        this.speed = value;
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
                    this.gui.add(this.options, 'sphereX', -2, 2).name('Sphere X').onChange((value) => {
                        this.sphere.position.x = value;
                    });
                    this.gui.add(this.options, 'sphereY', -2, 2).name('Sphere Y').onChange((value) => {
                        this.sphere.position.y = value;
                    });
                    this.gui.add(this.options, 'sphereZ', -2, 2).name('Sphere Z').onChange((value) => {
                        this.sphere.position.z = value;
                    });
                    this.gui.add(this.options, 'cubeX', -2, 2).name('Cube X').onChange((value) => {
                        this.cube.position.x = value;
                    });
                    this.gui.add(this.options, 'cubeY', -2, 2).name('Cube Y').onChange((value) => {
                        this.cube.position.y = value;
                    });
                    this.gui.add(this.options, 'cubeZ', -2, 2).name('Cube Z').onChange((value) => {
                        this.cube.position.z = value;
                    });
                    this.gui.add(this.options, 'SpotLightX', -20, 20).name('SpotLight X').onChange((value) => {
                        this.spotLight.position.x = value;
                        this.sLightHelper.update();
                    });
                    this.gui.add(this.options, 'SpotLightY', -20, 20).name('SpotLight Y').onChange((value) => {
                        this.spotLight.position.y = value;
                        this.sLightHelper.update();
                    });
                    this.gui.add(this.options, 'SpotLightZ', -20, 20).name('SpotLight Z').onChange((value) => {
                        this.spotLight.position.z = value;
                        this.sLightHelper.update();
                    });
                })();
            })();

            /**SCENE ELEMENTS */
            (()=>{

                /** GROUND */
                (()=>{
                    this.ground = new THREE.Mesh(
                        new THREE.BoxGeometry(5, 0.1, 5),
                        new THREE.MeshStandardMaterial({ 
                            color: "pink",
                            side: THREE.DoubleSide
                        })
                    );
                    this.ground.position.set(0, 0, 0);
                    this.ground.receiveShadow = true;
                    this.game.scene.add(this.ground);
                })();






                /**CHARACTERS*/
                (()=>{

                    /**MEGAN*/
                    (()=>{
                        const meganUrl = new URL('../../../assets/characters/megan/Megan.glb', import.meta.url);
                        this.glTFLoader.load(meganUrl.href, (gltf) => {
                            this.megan = gltf.scene;
                            this.megan.position.set(0, 0.045, 0);
                            this.game.scene.add(this.megan);

                            
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

    }

    /**TO USE IN ELEMENTS IN SCENE -> ANIMATION BOUNCING */
    bounceUpAndDown(element) {

        if(element){
            element.position.y += Math.sin(this.game.clock.getElapsedTime() * 2) * this.speed;
            element.rotation.y += Math.sin(this.game.clock.getElapsedTime() * 2) * this.speed;
        }
    }

}