import { Scene, Color, PerspectiveCamera, WebGLRenderer, AmbientLight, DirectionalLight } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



export class SceneManager {
    static VIEW_MODE = Object.freeze({
        MAP: 0,
        PANORAMA: 1,
        OUTSIDE: 2 
    });

    constructor() {
        this.viewMode = SceneManager.VIEW_MODE.PANORAMA;

        this.canvas = document.querySelector("#pano-container");
        this.scene = new Scene();
        this.scene.background = new Color(0x222222);
        
        this.camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableZoom = false;
        this.controls.enablePan = false;
        this.controls.rotateSpeed = -0.2; // invert the axis

        this.setupLights();
    }


    setupLights() {
        const light = new AmbientLight(0xF8F8F8, 2);
        const directional = new DirectionalLight(0xffffff, 3);
        directional.position.set(5, 10, 7.5);
        this.scene.add(light, directional);
    }

    moveCamera(pos) {
        this.camera.position.copy(pos);
        this.controls.target.set(pos.x, pos.y, pos.z + 0.1);
        this.controls.update();
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}