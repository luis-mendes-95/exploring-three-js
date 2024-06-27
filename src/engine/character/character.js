import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export class Character {
    constructor(game, meshURL, speed) {
        this.game = game;
        this.meshURL = meshURL;

        /** MOVEMENT */
        this.deceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
        this.acceleration = new THREE.Vector3(1, 0.25, 50.0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.speed = speed;
        this.toggleRun = false;
        this.fadeDuration = 0.2;
        this.runVelocity = 5;
        this.walkVelocity = 2;

        /**CAMERA */
        this.game.camera = new THREE.PerspectiveCamera(45, this.game.width / this.game.height, 0.1, 1000);
        this.game.camera.position.y = 5;
        this.game.camera.position.z = 5;
        this.game.camera.position.x = 0;

        // CONTROLS
        this.orbitControls = new OrbitControls(this.game.camera, this.game.renderer.domElement);
        this.orbitControls.enableDamping = true
        this.orbitControls.minDistance = 5
        this.orbitControls.maxDistance = 15
        this.orbitControls.enablePan = false
        this.orbitControls.maxPolarAngle = Math.PI / 2 - 0.05
        this.orbitControls.update();

        /**POSITION AND ROTATION */
        this.originalForwardVector = new THREE.Vector3(0, 0, -1);
        this.rotateQuarternion = new THREE.Quaternion();
        this.rotateAngle = new THREE.Vector3(0, 1, 0);
        this.walkDirection = new THREE.Vector3();
        this.cameraTarget = new THREE.Vector3();

        /** LOADERS */
        this.glTFLoader = new GLTFLoader();
        this.mixer = null;
        this.characterAnimations = null;
        this.characterCurrentState = 'IDLE';
        this.animateAction = null;

        /** CHARACTER -> GLTF */
        (() => {
            const meshURL = new URL(this.meshURL, import.meta.url);
            this.glTFLoader.load(meshURL.href, (gltf) => {
                this.character = gltf.scene;
                this.character.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                    }
                });
                this.character.position.set(0, 0, 0);

                this.game.scene.add(this.character);

                this.mixer = new THREE.AnimationMixer(this.character);
                this.characterAnimations = gltf.animations;

                // Initialize IDLE animation
                const idleAnimation = THREE.AnimationClip.findByName(this.characterAnimations, 'IDLE');
                if (idleAnimation) {
                    this.animateAction = this.mixer.clipAction(idleAnimation);
                    this.animateAction.play();
                } else {
                    console.error('IDLE animation not found');
                }
            }, undefined, (error) => { console.error(error) });
        })();
    }

    update(deltaTime) {

        if (this.mixer) {
            this.mixer.update(deltaTime);
        }

        this.handleAnimations();


        if (this.game.input.keys.includes('w') || this.game.input.keys.includes('W')) {
            // calculate towards camera direction
            let angleYCameraDirection = Math.atan2(
                    (this.game.camera.position.x - this.character.position.x), 
                    (this.game.camera.position.z - this.character.position.z))
            // diagonal movement angle offset
            let directionOffset = this.directionOffset();

            // rotate model
            this.rotateQuarternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + directionOffset)
            this.character.quaternion.rotateTowards(this.rotateQuarternion, 0.2)

            // calculate direction
            this.game.camera.getWorldDirection(this.walkDirection)
            this.walkDirection.y = 0
            this.walkDirection.normalize()
            this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset)

            // run/walk velocity
            const velocity = this.toggleRun ? this.runVelocity : this.walkVelocity

            // move model & camera
            const moveX = this.walkDirection.x * velocity * deltaTime
            const moveZ = this.walkDirection.z * velocity * deltaTime
            this.character.position.x += moveX
            this.character.position.z += moveZ
            this.updateCameraTarget(moveX, moveZ)
        }



    }

    updateCameraTarget(moveX, moveZ) {
        // move camera
        this.game.camera.position.x += moveX
        this.game.camera.position.z += moveZ

        // update camera target
        this.cameraTarget.x = this.character.position.x
        this.cameraTarget.y = this.character.position.y + 1
        this.cameraTarget.z = this.character.position.z
        this.orbitControls.target = this.cameraTarget
    }

    handleAnimations() {
        if (!this.characterAnimations) return;

        const walkAnimation = THREE.AnimationClip.findByName(this.characterAnimations, 'WALKING');
        const idleAnimation = THREE.AnimationClip.findByName(this.characterAnimations, 'IDLE');

        if (this.velocity.length() > 0) {
            if (this.characterCurrentState !== 'WALKING' && walkAnimation) {
                const walkAction = this.mixer.clipAction(walkAnimation);
                const currentAction = this.mixer.clipAction(THREE.AnimationClip.findByName(this.characterAnimations, this.characterCurrentState));

                if (currentAction && walkAction) {
                    currentAction.fadeOut(0.5);
                    walkAction.reset().fadeIn(0.5).play();
                    this.characterCurrentState = 'WALKING';
                }
            }
        } else {
            if (this.characterCurrentState !== 'IDLE' && idleAnimation) {
                const idleAction = this.mixer.clipAction(idleAnimation);
                const currentAction = this.mixer.clipAction(THREE.AnimationClip.findByName(this.characterAnimations, this.characterCurrentState));

                if (currentAction && idleAction) {
                    currentAction.fadeOut(0.5);
                    idleAction.reset().fadeIn(0.5).play();
                    this.characterCurrentState = 'IDLE';
                }
            }
        }
    }

    switchRunToggle() {
        this.toggleRun = !this.toggleRun
    }

    directionOffset() {
        let directionOffset = 0 // w

        if (this.game.input.keys.includes('w') || this.game.input.keys.includes('W')){
            if (this.game.input.keys.includes('a') || this.game.input.keys.includes('A')) {
                directionOffset = Math.PI / 4 // w+a
            } else if (this.game.input.keys.includes('d') || this.game.input.keys.includes('D')) {
                directionOffset = - Math.PI / 4 // w+d
            }
        } else if (this.game.input.keys.includes('s') || this.game.input.keys.includes('S')) {
            if (this.game.input.keys.includes('a') || this.game.input.keys.includes('A')) {
                directionOffset = Math.PI / 4 + Math.PI / 2 // s+a
            } else if (this.game.input.keys.includes('d') || this.game.input.keys.includes('D')) {
                directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d
            } else {
                directionOffset = Math.PI // s
            }
        } else if (this.game.input.keys.includes('a') || this.game.input.keys.includes('A')) {
            directionOffset = Math.PI / 2 // a
        } else if (this.game.input.keys.includes('d') || this.game.input.keys.includes('D')) {
            directionOffset = - Math.PI / 2 // d
        }

        return directionOffset
    }
}
