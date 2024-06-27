/** THREE.JS IMPORT */
import * as THREE from 'three';

export class ThirdPersonCamera {
    constructor(params){
        this._params = params;
        this.camera = params.camera;

        this.currentPosition = new THREE.Vector3();
        this.currentLookAt = new THREE.Vector3();
    }

    calculateIdealOffset(){
        const idealOffset = new THREE.Vector3(-15, 20, -30); 
        idealOffset.applyQuaternion(this._params.target.Rotation);
        idealOffset.add(this._params.target.Position);
        return idealOffset;
    }

    calculateIdealLookAt(){
        const idealLookAt = new THREE.Vector3(0, 10, 50);
        idealLookAt.applyQuaternion(this._params.target.Rotation);
        idealLookAt.add(this._params.target.Position);
        return idealLookAt;
    }

    update(timeElapsed){
        const idealOffset = this.calculateIdealOffset();
        const idealLookAt = this.calculateIdealLookAt();

        const t = 0.05;

        this.currentPosition.lerp(idealOffset, t);
        this.currentLookAt.copy(idealLookAt, t);

        this.camera.position.copy(this.currentPosition);
        this.camera.lookAt(this.currentLookAt);
    }
}