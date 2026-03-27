import { TestEffect } from "./TestEffect.js";

Hooks.once("diceSoNiceReady", (dsn) => {
  dsn.addSFXMode(TestEffect);

  // setTimeout(test, 1000);
  test();
});

function test() {
  const data = {
    throws: [
      {
        dice: [
          {
            result: 2,
            resultLabel: 2,
            type: "d2",
            vectors: [],
            options: {},
          },
        ],
      },
    ],
  };
  game.dice3d.show(data);
}
