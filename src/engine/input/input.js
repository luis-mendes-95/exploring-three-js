import * as THREE from 'three';

export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = [];
        this.mouse = {
            x: 0,
            y: 0,
            clicked: false
        };
        this.mousePosition = new THREE.Vector2();
        this.touchPosition = new THREE.Vector2();
        this.touches = [];

        const canvas = this.game.renderer.domElement; // Acessa o canvas do renderer do THREE.js

        window.addEventListener('keydown', (e) => {
            e.preventDefault();
            if (!this.keys.includes(e.key)) this.keys.push(e.key);
        });

        window.addEventListener('keyup', (e) => {
            e.preventDefault();
            this.keys = this.keys.filter(key => key !== e.key);
        });

        canvas.addEventListener('mousemove', (e) => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
            this.mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
            this.mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.mouse.clicked = true;
        });

        canvas.addEventListener('mouseup', (e) => {
            e.preventDefault();
            this.mouse.clicked = false;
        });

        // Adiciona suporte a eventos de toque
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            for (let i = 0; i < e.touches.length; i++) {
                const touch = e.touches[i];
                this.touches.push({
                    id: touch.identifier,
                    x: (touch.clientX - rect.left) * (canvas.width / rect.width),
                    y: (touch.clientY - rect.top) * (canvas.height / rect.height)
                });
                this.touchPosition.x = (touch.clientX / window.innerWidth) * 2 - 1;
                this.touchPosition.y = -(touch.clientY / window.innerHeight) * 2 + 1;

            }
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            for (let i = 0; i < e.touches.length; i++) {
                const touch = e.touches[i];
                const index = this.touches.findIndex(t => t.id === touch.identifier);
                if (index !== -1) {
                    this.touches[index].x = (touch.clientX - rect.left) * (canvas.width / rect.width);
                    this.touches[index].y = (touch.clientY - rect.top) * (canvas.height / rect.height);
                    this.touchPosition.x = (touch.clientX / window.innerWidth) * 2 - 1;
                    this.touchPosition.y = -(touch.clientY / window.innerHeight) * 2 + 1;
                }
            }
        });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                this.touches = this.touches.filter(t => t.id !== touch.identifier);
            }
        });
    }
}