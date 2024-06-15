// src/customClasses/scenes/scene0/scene0.js
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export class Scene0 {
    constructor(game) {
        /** GAME */
        this.game = game;
        this.speed = 0.01;

        /**CAMERA START CONFIG*/
        this.game.camera.position.set(0, 3, 3);

        /**LIGHTNING */
        this.ambientLight = new THREE.AmbientLight("white", 1);
        this.directionalLight = new THREE.DirectionalLight("white", 1);
        this.directionalLight.position.set(1, 3, 0);
        this.directionalLight.castShadow = true;
        this.game.scene.add(this.ambientLight);
        this.game.scene.add(this.directionalLight);

        /** GUI */
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
            OrbitControls: false
        };
        document.body.appendChild(this.gui.domElement);

        /** GUI Controls */
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

        /** CUBE */
        this.cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ color: 0x00ff00 })
          );
          this.cube.position.set(0.5, 1, 0.5);
          this.game.scene.add(this.cube);
            this.cube.castShadow = true;

        /** SPHERE -> MESH STANDARD MATERIAL -> RECEIVES LIGHT*/
        this.sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 256, 256),
            new THREE.MeshStandardMaterial({ 
                color: 0xffff00
            })
        );
        this.sphere.position.set(-1, 0.5, 0);
        this.game.scene.add(this.sphere);
        this.sphere.castShadow = true;
        this.sphere.receiveShadow = true;

        /** HELPERS */
        this.axesHelper = new THREE.AxesHelper(2);
        this.gridHelper = new THREE.GridHelper(10, 10);
        this.dLightHelper = new THREE.DirectionalLightHelper(this.directionalLight, 1);


        /** GROUND */
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
        this.game.scene.add(this.axesHelper);
        this.game.scene.add(this.gridHelper);
        this.game.scene.add(this.dLightHelper);

        // Debugging information to check GUI creation
        console.log('GUI created:', this.gui);
    }

    createCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        return new THREE.Mesh(geometry, material);
    }

    update(deltaTime) {
        this.bounceUpAndDown();
    }

    bounceUpAndDown() {
        this.sphere.position.x += Math.sin(this.game.clock.getElapsedTime() * 2) * 0.01;
        this.sphere.rotation.x += Math.sin(this.game.clock.getElapsedTime() * 2) * 0.2;

        this.cube.position.y += Math.sin(this.game.clock.getElapsedTime() * 2) * this.speed;
        this.cube.rotation.y += Math.sin(this.game.clock.getElapsedTime() * 2) * this.speed;
    }

    draw() {
        // All drawing is handled by Three.js renderer, so this method can be empty
    }
}