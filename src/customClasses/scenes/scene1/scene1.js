import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import cosmoBackground from '../../../assets/backgrounds/cosmo.jpg';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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

                /**LOADERS */
                this.glTFLoader = new GLTFLoader();
                this.mixer = null;
                this.meganAnimations = null;
                this.meganCurrentState = 'IDLE';
                this.animateAction = null;
            })();

            /**CAMERA SETUP*/
            (() => {
                this.game.camera.position.set(0.5, 1.6, 1.5);
                this.game.camera.rotation.set(-0.2, 0, 0);
            })();

            /**BACKGROUND RENDERING*/
            (() => {
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

                document.body.appendChild(this.gui.domElement);

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
                (() => {
                    /**MEGAN -> GLTF*/
                    (() => {
                        const meganUrl = new URL('../../../assets/characters/megan/Megan.glb', import.meta.url);
                        this.glTFLoader.load(meganUrl.href, (gltf) => {
                            this.megan = gltf.scene;
                            this.megan.traverse((child) => {
                                if (child.isMesh) {
                                    child.castShadow = true;
                                }
                            });
                            this.megan.position.set(0, 0.045, 0);
                            this.megan.rotation.set(0, Math.PI, 0);
                            this.game.scene.add(this.megan);

                            this.mixer = new THREE.AnimationMixer(this.megan);
                            this.meganAnimations = gltf.animations;

                            // Inicializando a animação IDLE
                            const idleAnimation = THREE.AnimationClip.findByName(this.meganAnimations, 'IDLE');
                            if (idleAnimation) {
                                this.animateAction = this.mixer.clipAction(idleAnimation);
                                this.animateAction.play();
                            } else {
                                console.error('IDLE animation not found');
                            }
                        }, undefined, (error) => { console.error(error) });
                    })();
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
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }

        this.handleAnimations();
    }

    /**TO USE IN ELEMENTS IN SCENE -> ANIMATION BOUNCING */
    bounceUpAndDown(element) {
        if (element) {
            element.position.y += Math.sin(this.game.clock.getElapsedTime() * 2) * this.speed;
            element.rotation.y += Math.sin(this.game.clock.getElapsedTime() * 2) * this.speed;
        }
    }

    handleAnimations() {
        if (!this.meganAnimations) return;
    
        const walkAnimation = THREE.AnimationClip.findByName(this.meganAnimations, 'WALKING');
        const idleAnimation = THREE.AnimationClip.findByName(this.meganAnimations, 'IDLE');
    
        if (this.game.input.keys.includes('w') || this.game.input.keys.includes('W') && !this.game.input.keys.includes('Shift')) {
            if (this.meganCurrentState !== 'WALKING' && walkAnimation) {
                const walkAction = this.mixer.clipAction(walkAnimation);
                const currentAction = this.mixer.clipAction(THREE.AnimationClip.findByName(this.meganAnimations, this.meganCurrentState));
    
                if (currentAction && walkAction) {
                    currentAction.fadeOut(0.5);
                    walkAction.reset().fadeIn(0.5).play();
                    this.meganCurrentState = 'WALKING';
                }
            }
            this.megan.position.z -= this.speed;
            this.game.camera.position.z -= this.speed;
        } else {
            if (this.meganCurrentState !== 'IDLE' && idleAnimation) {
                const idleAction = this.mixer.clipAction(idleAnimation);
                const currentAction = this.mixer.clipAction(THREE.AnimationClip.findByName(this.meganAnimations, this.meganCurrentState));
    
                if (currentAction && idleAction) {
                    currentAction.fadeOut(0.5);
                    idleAction.reset().fadeIn(0.5).play();
                    this.meganCurrentState = 'IDLE';
                }
            }
        }

        if(this.game.input.keys.includes('d') || this.game.input.keys.includes('D')) {
            this.megan.rotation.y -= this.speed;
        }

        if(this.game.input.keys.includes('a') || this.game.input.keys.includes('A') && this.megan.rotation.y < Math.PI / 2) {
            this.megan.rotation.y += this.speed * 2;
        }

        if(this.game.input.keys.includes('s') || this.game.input.keys.includes('S')) {
            this.megan.position.z += this.speed;
            this.game.camera.position.z += this.speed * 2;
        }

    }
    
}
