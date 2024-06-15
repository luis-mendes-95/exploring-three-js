/** INDIVIDUAL SCENES */
import { Scene0 } from './src/customClasses/scenes/scene0/scene0.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/** THREE.JS IMPORT */
import * as THREE from 'three';
import { Scene1 } from './src/customClasses/scenes/scene1/scene1.js';
import { InputHandler } from './src/engine/input/input.js';

/** AFTER EVERYTHING LOADS, IT WILL RUN */
window.addEventListener('load', function() {

    /** CLASS GAME WILL CENTRALIZE EVERY GAME ELEMENTS INSIDE OF IT */
    class Game {
        constructor(width, height) {



            /** THREE.JS SCENE SETUP */
            this.scene = new THREE.Scene();

            /** CAMERA */
            this.camera = new THREE.PerspectiveCamera(
                75, /** FIELD OF VIEW */
                width / height, /** ASPECT RATIO */
                0.1, /** NEAR */
                100 /** FAR */
            );

            /** ORBIT CONTROLS */
            //this.orbit = new OrbitControls(this.camera, document.body);
            //this.orbit.update();

            /** CLOCK */
            this.clock = new THREE.Clock();

            /** POSITION */
            this.camera.position.set(0, 3, 3);
            this.camera.rotation.set(-0.9, 0, 0);

            /** RENDERER */
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(width, height);
            this.renderer.shadowMap.enabled = true;
            document.body.appendChild(this.renderer.domElement);

            /**RAY CASTER */
            this.rayCaster = new THREE.Raycaster();


            /**INPUT HANDLER */
            this.input = new InputHandler(this);

            /** PLAYER STATS */
            this.playerName = "";
            this.currentStage = 0;
            this.playerPoints = 0;
            this.difficulty = "";

            /** GLOBAL MEASURES -> WIDTH | HEIGHT | SPEED */
            this.width = width;
            this.height = height;
            this.speed = width / 100;
            this.isFullScreen = false;

            /** LOADING FONTS */
            let font = new FontFace('PatrickHand', 'url(./src/assets/fonts/PatrickHand-Regular.ttf)');
            let font1942 = new FontFace('font1942', 'url(./src/assets/fonts/1942.ttf)');
            Promise.all([font.load(), font1942.load()])
            .then(loadedFonts => {
                loadedFonts.forEach(font => document.fonts.add(font));
            })
            .catch(error => console.log(error));

            /** SCENES MANAGEMENT */
            this.currentScene = new Scene0(this);

            /** HANDLE CANVAS SCALING */
            window.addEventListener('resize', this.resizeCanvas.bind(this));
            this.resizeCanvas();
        }

        changeScene(newScene) {
            this.currentScene = new newScene(this);
        }

        update(deltaTime) {
            /** UPDATING SCENE */
            this.currentScene.update(deltaTime);
        }

        draw() {
            /** DRAWING SCENE */
            this.renderer.render(this.scene, this.camera);
            this.currentScene.draw();
        }

        toggleFullScreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen(); 
                }
            }
            this.isFullScreen = !this.isFullScreen;
        }

        resizeCanvas() {
            const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
            const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
            this.camera.aspect = viewportWidth / viewportHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(viewportWidth, viewportHeight);
        }
    }

    /** INSTANTIATING THE GAME CLASS */
    const game = new Game(window.innerWidth, window.innerHeight);

    /** GAME LOOP */
    let lastTime = 0;
    const animate = (timeStamp) => {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        game.update(deltaTime);
        game.rayCaster.setFromCamera(game.input.mousePosition, game.camera);
        game.rayCaster.setFromCamera(game.input.touchPosition, game.camera);
        game.intersects = game.rayCaster.intersectObjects(game.scene.children, true);
        game.draw();
        requestAnimationFrame(animate);
    }
    animate(0);
});