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

  barsTime = 2;
  barsCount = 4;

  static async init() {
    const geometry = new PlaneGeometry(1, 1);
    const material = new MeshBasicMaterial({});
    TestEffect.backgroundPlane = new Mesh(geometry, material);
  }

  async play() {
    this.clock = new Clock();

    this.bars = [];

    this.box.desk.geometry.computeBoundingBox();
    this.maxX = this.box.desk.geometry.boundingBox.max.x;

    let height = this.box.desk.geometry.boundingBox.max.y * 0.05;

    for (let i = 0; i < this.barsCount; i++) {
      let bar = TestEffect.backgroundPlane.clone();
      bar.receiveShadow = false;

      bar.scale.set(this.box.desk.geometry.boundingBox.max.x, height, 1);

      bar.position.z = 1;
      bar.position.y = i * height;

      this.box.scene.add(bar);

      this.bars.push(bar);
    }

    this.dicemesh.position.z -= 1;
    this.renderReady = true;
  }

  easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  lerp(a, b, t) {
    return a + (b - a) * t;
  }

  render() {
    const t = this.clock.getElapsedTime();
    if (t < this.barsTime + 1) {
      const bt = t / this.barsTime;
      for (let i = 0; i < this.barsCount; i++) {
        this.bars[i].position.x =
          this.lerp(
            this.maxX,
            0,
            this.easeOutCubic(Math.min(1, bt - Math.abs(i - 1.5) / 4)),
          ) * (i % 2 == 0 ? 1 : -1);
      }

      this.plane;
    }

    // if ( > 5) {
    //   // this.destroy();
    // }
  }

  destroy() {
    this.box.scene.remove(this.plane);
    this.destroyed = true;
  }
}
