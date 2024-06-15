import * as THREE from 'three';

export class Scene1 {
    constructor(game) {
        this.game = game;
        this.cube = this.createCube();
        this.game.scene.add(this.cube);
    }

    createCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: "blue" });
        return new THREE.Mesh(geometry, material);
    }

    update(deltaTime) {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
    }

    draw(scene, camera) {
        // All drawing is handled by Three.js renderer, so this method can be empty
    }
}
