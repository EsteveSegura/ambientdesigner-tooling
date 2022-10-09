import * as THREE from "three";

export class Line {
  constructor({initialPos, targetPos, color= 0xfc0320, scene }) {
    // Basics
    this.initialPos = initialPos;
    this.targetPos = targetPos;
    this.scene = scene;
    this.color = color;

    // Geometry
    this.lineMaterial = null;
    this.lineGeometry = null;
    this.line = null;

    // Initial
    this.init(this.initialPos, this.targetPos);
  }

  init(initialPos, targetPos) {
    this.lineMaterial = new THREE.LineBasicMaterial({color: this.color});
    this.lineGeometry = new THREE.BufferGeometry().setFromPoints([initialPos, targetPos]);
    this.line = new THREE.Line(this.lineGeometry,this.lineMaterial)

    this.scene.add(this.line)
  }

  update(initialPos, targetPos) {
    this.lineGeometry.setFromPoints([initialPos, targetPos]);
  }
}
