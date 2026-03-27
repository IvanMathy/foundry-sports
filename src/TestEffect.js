import { DiceSFX } from "../../dice-so-nice/api.js";
import {
  MeshBasicMaterial,
  PlaneGeometry,
  Mesh,
  Clock,
} from "../../dice-so-nice/libs/three.module.min.js";

export class TestEffect extends DiceSFX {
  static id = "FoundrySports";
  static specialEffectName = "Animation: Foundry Sports";

  static PLAY_ONLY_ONCE_PER_MESH = true;

  static backgroundPlane = null;

  static async init() {
    const geometry = new PlaneGeometry(1, 1);
    const material = new MeshBasicMaterial({});
    TestEffect.backgroundPlane = new Mesh(geometry, material);
  }

  async play() {
    this.clock = new Clock();
    this.plane = TestEffect.backgroundPlane.clone();
    this.plane.receiveShadow = this.box.shadows;

    this.plane.position.x = 0;
    this.plane.position.y = 0;
    this.plane.position.z = 1;
    this.plane.rotation.z = 0;
    this.box.scene.add(this.plane);

    this.box.desk.geometry.computeBoundingBox();

    this.plane.scale.set(
      this.box.desk.geometry.boundingBox.max.x * 0.8,
      this.box.desk.geometry.boundingBox.max.y * 0.8,
      1,
    );

    this.dicemesh.position.z -= 1;
    this.renderReady = true;

    console.log(this.box);
  }

  render() {
    this.plane.position.x = this.clock.getElapsedTime() * 10;

    if (this.clock.getElapsedTime() > 5) {
      // this.destroy();
    }
  }

  destroy() {
    this.box.scene.remove(this.plane);
    this.destroyed = true;
  }
}
