// Deterministic screenshot states, driven by ?shot= and ?seed=:
// start shows the title overlay, play shows a level mid-hunt with
// two differences found and four still to find, end shows the win
// screen after every difference is found.
import { LEVELS } from "./scenes.js";

export function applyShot(game) {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get("shot") || "";
  if (shot === "play") {
    game.hideOverlay();
    game.startLevel(0);
    game.found = [game.level.diffs[0], game.level.diffs[2]];
    game.score = 200;
    game.timeLeft = 73;
    game.setMessage("Found it — the sun turned into a moon! 4 remain.");
    game.render();
  } else if (shot === "end") {
    game.hideOverlay();
    game.startLevel(2);
    game.found = [...game.level.diffs];
    game.score = 1840;
    game.timeLeft = 21;
    game.render();
    game.levelClear();
  } else if (shot === "level2") {
    game.hideOverlay();
    game.startLevel(1);
    game.found = [game.level.diffs[1]];
    game.score = 100;
    game.timeLeft = 88;
    game.setMessage("Found it — a lantern changed colour! 5 remain.");
    game.render();
  }
}
