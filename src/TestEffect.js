import { DiceSFX } from "../../dice-so-nice/api.js";
import {
  MeshBasicMaterial,
  PlaneGeometry,
  Mesh,
  Clock,
  MeshMatcapMaterial,
  DirectionalLight,
  Object3D,
  TextureLoader,
} from "../../dice-so-nice/libs/three.module.min.js";
import { FontLoader } from "./lib/FontLoader.js";
import { TextGeometry } from "./lib/TextGeometry.js";
import { USDLoader } from "./lib/USDLoader.js";

export class TestEffect extends DiceSFX {
  static id = "FoundrySports";
  static specialEffectName = "Animation: Foundry Sports";

  static PLAY_ONLY_ONCE_PER_MESH = true;

  static backgroundPlane = null;

  barsTime = 2;
  textInTime = 4;
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
    this.maxY = this.box.desk.geometry.boundingBox.max.y;

    let height = this.box.desk.geometry.boundingBox.max.y * 0.05;

    for (let i = 0; i < this.barsCount; i++) {
      let bar = TestEffect.backgroundPlane.clone();
      bar.receiveShadow = false;

      bar.scale.set(this.box.desk.geometry.boundingBox.max.x, height, 1);

      bar.position.z = 1;
      bar.position.y = i * height;
      bar.position.x = this.maxX;

      this.box.scene.add(bar);
      this.bars.push(bar);
    }

    this.dicemesh.position.z -= 1;

    this.loadFont();
  }

  easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  easeInBack(x) {
    const c1 = 1.70158;
    const c3 = c1 + 1;

    return c3 * x * x * x - c1 * x * x;
  }

  lerp(a, b, t) {
    return a + (b - a) * t;
  }

  loadFont() {
    const loader = new FontLoader();
    loader.load(
      "/modules/foundry-sports/src/helvetiker_bold.typeface.json",
      (response) => this.createText(response),
    );
  }

  async createText(font) {
    let text = "Natural 20",
      bevelEnabled = true;
    const depth = 20,
      size = 70,
      hover = 0,
      curveSegments = 10,
      bevelThickness = 10,
      bevelSize = 10;

    const loader = new TextureLoader();

    const usdLoader = new USDLoader();

    const diceScene = await usdLoader.loadAsync(
      "/modules/foundry-sports/src/assets/dice.usdc",
    );

    this.dice = diceScene.getObjectByName("defaultMaterial_002", true);
    //   .getObjectByName("defaultMaterial", true);

    this.gold = await loader.loadAsync(
      "/modules/foundry-sports/src/assets/matcap.png",
    );

    this.materials = [
      new MeshBasicMaterial({
        color: 0xffffff,
      }),
      new MeshMatcapMaterial({
        color: 0xffffff,
        matcap: this.gold,
        flatShading: false,
      }),
    ];

    this.dice.material = this.materials[1];

    this.textGeo = new TextGeometry(text, {
      font: font,

      size: size,
      depth: depth,
      curveSegments: curveSegments,

      bevelThickness: bevelThickness,
      bevelSize: bevelSize,
      bevelEnabled: bevelEnabled,
    });

    this.textGeo.computeBoundingBox();

    const centerOffset =
      -0.5 * (this.textGeo.boundingBox.max.x - this.textGeo.boundingBox.min.x);

    const verticalCenter =
      -0.5 * (this.textGeo.boundingBox.max.y - this.textGeo.boundingBox.min.y);

    let textMesh1 = new Mesh(this.textGeo, this.materials);

    textMesh1.position.x = centerOffset;
    textMesh1.position.y = -verticalCenter;
    textMesh1.position.z = 0;

    // Jank
    this.targetTextPosition = textMesh1.position.clone();

    textMesh1.position.y = this.box.camera.position.y - 20;
    textMesh1.position.z = this.box.camera.position.z;

    this.initialTextPosition = textMesh1.position.clone();

    textMesh1.rotation.x = 0;
    textMesh1.rotation.y = Math.PI * 2;

    this.box.scene.add(textMesh1);
    this.textMesh = textMesh1;

    this.textMesh.add(diceScene);

    diceScene.scale.set(300, 300, 300);
    diceScene.position.set(
      -centerOffset * 2 - centerOffset * 0.2,
      -verticalCenter * 0.8,
      0,
    );

    const otherDice = diceScene.clone();

    diceScene.position.x = centerOffset * 0.3;
    this.textMesh.add(otherDice);

    this.renderReady = true;
  }

  render() {
    if (!this.renderReady) return;

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

    this.gold.rotation = t;
    this.gold.offset.x = t;
    this.materials[1].matcap = this.gold;

    // this.dice.rotation.x = this.lerp(t);

    if (t < this.textInTime) {
      const tt = this.easeOutCubic(t / this.textInTime);
      this.textMesh.position.z = this.lerp(
        this.initialTextPosition.z,
        this.targetTextPosition.z,
        tt,
      );

      this.textMesh.position.y = this.lerp(
        this.initialTextPosition.y,
        this.targetTextPosition.y,
        tt,
      );

      this.textMesh.rotation.x = this.lerp(-1, 0, tt);
    }

    if (t > this.textInTime + 1) {
      const tl = t - this.textInTime - 1;

      for (let i = 0; i < this.barsCount; i++) {
        this.bars[i].position.x =
          this.lerp(
            0,
            this.maxX,
            this.easeOutCubic(
              Math.max(0, Math.min(1, tl - Math.abs(i - 1.5) / 4)),
            ),
          ) * (i % 2 == 0 ? 1 : -1);
      }
      this.textMesh.position.y = this.lerp(
        this.targetTextPosition.y,
        -this.maxY * 1.1,
        this.easeInBack(tl),
      );
    }

    if (t > this.textInTime + 2) {
      this.destroy();
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
