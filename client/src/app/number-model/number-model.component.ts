import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { ThreeService } from '../service/three.service';

@Component({
  selector: 'app-number-model',
  templateUrl: './number-model.component.html',
  styleUrls: ['./number-model.component.css'],
})
export class NumberModelComponent implements OnInit {
  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  constructor(private threeService: ThreeService) {}

  ngOnInit(): void {
    this.threeService.createScene(this.rendererCanvas);
    this.threeService.animate();
  }
  // @ViewChild('canvas') private canvasRef: ElementRef;

  // ngAfterViewInit(): void {
  //   this.createScene();
  //   this.startRenderingLoop();
  // }

  // // Cube
  // @Input() public rotationSpeedX: number = 0.05;
  // @Input() public rotationSpeedY: number = 0.01;
  // @Input() public size: number = 200;
  // @Input() public texture: string =
  //   'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2874&q=80';

  // // Stage
  // @Input() public cameraZ: number = 400;
  // @Input() public fieldOfView: number = 1;
  // @Input('nearClipping') public nearClippingPlane: number = 1;
  // @Input('farClipping') public farClippingPlane: number = 1000;

  // private camera!: THREE.PerspectiveCamera;

  // private get canvas(): HTMLCanvasElement {
  //   return this.canvasRef.nativeElement;
  // }

  // private loader = new THREE.TextureLoader();
  // private geometry = new THREE.BoxGeometry(1, 1, 1);
  // private material = new THREE.MeshBasicMaterial({
  //   map: this.loader.load(this.texture),
  // });
  // private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);
  // private renderer!: THREE.WebGL1Renderer;
  // private scene!: THREE.Scene;

  // private createScene() {
  //   this.scene = new THREE.Scene();
  //   this.scene.background = new THREE.Color(0x000000);
  //   this.scene.add(this.cube);

  //   let aspectRatio = this.getAspectRatio();

  //   this.camera = new THREE.PerspectiveCamera(
  //     this.fieldOfView,
  //     aspectRatio,
  //     this.nearClippingPlane,
  //     this.farClippingPlane
  //   );
  //   this.camera.position.z = this.cameraZ;
  // }

  // private getAspectRatio() {
  //   return this.canvas.clientWidth / this.canvas.clientHeight;
  // }

  // private animateCube() {
  //   this.cube.rotation.x += this.rotationSpeedX;
  //   this.cube.rotation.y += this.rotationSpeedY;
  // }

  // private startRenderingLoop() {
  //   this.renderer = new THREE.WebGL1Renderer({ canvas: this.canvas });
  //   this.renderer.setPixelRatio(devicePixelRatio);
  //   this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

  //   let component: NumberModelComponent = this;
  //   (function render() {
  //     requestAnimationFrame(render);
  //     component.animateCube();
  //     component.renderer.render(component.scene, component.camera);
  //   });
  // }
}
