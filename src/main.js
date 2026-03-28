import { TestEffect } from "./TestEffect.js";

Hooks.once("diceSoNiceReady", (dsn) => {
  dsn.addSFXMode(TestEffect);

  console.log(dsn);

  // setTimeout(test, 1000);
  test();
});

function test() {
  const data = {
    throws: [
      {
        dice: [
          {
            result: 20,
            resultLabel: 20,
            type: "d20",
            vectors: [],
            options: {},
          },
        ],
      },
    ],
  };
  game.dice3d.show(data);
}
