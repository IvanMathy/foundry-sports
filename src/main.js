import { Nat20Effect } from "./Nat20Effect.js";

Hooks.once("diceSoNiceReady", (dsn) => {
  dsn.addSFXMode(Nat20Effect);
  // test();
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
