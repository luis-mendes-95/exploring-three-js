// src/customClasses/scenes/scene0/scene0.js
import * as THREE from 'three';

export class Scene0 {
    constructor(game) {
        this.game = game;
        this.cube = this.createCube();
        this.game.scene.add(this.cube);

        /**HELPERS */
        this.axesHelper = new THREE.AxesHelper(2);

        /**GROUND*/
        this.ground = new THREE.Mesh(
            new THREE.BoxGeometry(5, 0, 5),
            new THREE.MeshBasicMaterial({ color: "pink"})
        );
        this.ground.position.y = -1;

        this.game.scene.add(this.ground);
        this.game.scene.add(this.axesHelper);
    }

    createCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        return new THREE.Mesh(geometry, material);
    }

    update(deltaTime) {
        //this.cube.rotation.x += 0.01;
        //this.cube.rotation.y += 0.01;

        this.bounceUpAndDown(1, 1, deltaTime);
    }

    bounceUpAndDown(){
        this.cube.position.y = this.cube.position.y + Math.sin(this.game.clock.getElapsedTime() * 2) * 0.01;
        this.cube.rotation.y = this.cube.rotation.y + Math.sin(this.game.clock.getElapsedTime() * 2) * 0.2;
    }

    draw() {
        // All drawing is handled by Three.js renderer, so this method can be empty
        
    }
}
