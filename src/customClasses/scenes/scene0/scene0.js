import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import cosmoBackground from '../../../assets/backgrounds/cosmo.jpg';

export class Scene0 {
    constructor(game) {
        /** GAME */
        this.game = game;
        this.speed = 0.01;

        /**CAMERA START CONFIG*/
        this.game.camera.position.set(0, 3, 3);

        /**BACKGROUND*/
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

        /**LIGHTNING */
        /**AMBIENT*/
        this.ambientLight = new THREE.AmbientLight("white", 0.05);
        
        /**DIRECTIONAL*/
        this.directionalLight = new THREE.DirectionalLight("white", 1);
        this.directionalLight.position.set(4, 8, 0);
        this.directionalLight.castShadow = true;
        
        /**SPOT*/
        this.spotLight = new THREE.SpotLight("white", 7, 100, Math.PI / 4, 0.5, 2);
        this.spotLight.position.set(0, 3, 0);
        this.spotLight.castShadow = true;

        /**FOG */
        this.fog = new THREE.FogExp2("lightgray", 0.03);

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
            OrbitControls: false,

            SpotLightX: 0,
            SpotLightY: 3,
            SpotLightZ: 0
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

        /** CUBE */
        this.cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ color: 0x00ff00 }),
        );
        this.cube.position.set(0.5, 2, 0.5);
        this.cube.castShadow = true;
        this.cube.receiveShadow = true;

        /**TEXTURED CUBE */
        this.texturedCubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        this.textureCubeMaterial = new THREE.MeshBasicMaterial({
            //color: "gray",
            map: this.textureLoader.load(cosmoBackground) });
        this.textureCube = new THREE.Mesh(this.texturedCubeGeometry, this.textureCubeMaterial);
        this.textureCube.position.set(-1, 1, 1);
        this.textureCube.castShadow = true;
        this.textureCube.receiveShadow = true;


        /** SPHERE -> MESH STANDARD MATERIAL -> RECEIVES LIGHT*/
        this.sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 256, 256),
            new THREE.MeshStandardMaterial({ color: 0xffff00 })
        );
        this.sphere.position.set(-1, 0.5, 0);
        this.sphere.castShadow = true;
        this.sphere.receiveShadow = true;

        this.complexShaderMaterial = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vViewPosition;
        
                void main() {
                    vNormal = normalMatrix * normal;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    vViewPosition = -mvPosition.xyz;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                varying vec3 vViewPosition;
        
                uniform vec3 baseColor;
        
                void main() {
                    vec3 ambientColor = vec3(0.2, 0.2, 0.2); // Cor ambiente
                    vec3 lightColor = vec3(1.0, 1.0, 1.0);   // Cor da luz
        
                    vec3 lightDir = normalize(vec3(0.5, 0.5, 0.5)); // Direção da luz
                    float NdotL = max(dot(normalize(vNormal), lightDir), 0.0); // Componente difusa
        
                    vec3 viewDir = normalize(vViewPosition);
                    vec3 halfwayDir = normalize(lightDir + viewDir);
        
                    float specularStrength = 0.5; // Intensidade especular
                    float shininess = 32.0;        // Brilho
        
                    float NdotH = max(dot(normalize(vNormal), halfwayDir), 0.0);
                    float specular = pow(NdotH, shininess) * specularStrength; // Componente especular
        
                    vec3 diffuse = baseColor.rgb * lightColor * NdotL;
                    vec3 specularComponent = specular * lightColor;
        
                    vec3 finalColor = ambientColor + diffuse + specularComponent;
        
                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `,
            uniforms: {
                baseColor: { value: new THREE.Color(0xffff00) }
            }
        });
        

        /**SPHERE -> WITH SHADERS */
        this.complexSphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 64, 64),
            this.complexShaderMaterial
        );
        this.complexSphere.position.set(1, 1, 1);
        this.complexSphere.castShadow = true; // Permitir que a esfera projete sombras
        this.complexSphere.receiveShadow = true; // Permitir que a esfera receba sombras

        /** HELPERS */
        this.axesHelper = new THREE.AxesHelper(2);
        this.gridHelper = new THREE.GridHelper(10, 10);
        this.dLightHelper = new THREE.DirectionalLightHelper(this.directionalLight, 1);
        this.dLightShadowHelper = new THREE.CameraHelper(this.directionalLight.shadow.camera);
        this.sLightHelper = new THREE.SpotLightHelper(this.spotLight);

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

        /**ADDING ELEMENTS INTO SCENE */
        //this.game.scene.add(this.ambientLight);
        this.game.scene.add(this.cube);
        this.game.scene.add(this.sphere);
        this.game.scene.add(this.ground);
        this.game.scene.add(this.spotLight);
        //this.game.scene.add(this.sLightHelper);
        this.game.scene.add(this.dLightHelper);
        this.game.scene.fog = this.fog;
        this.game.scene.add(this.textureCube);
        this.game.scene.add(this.complexSphere);

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