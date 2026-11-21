// Lantern Lane — Spot the Difference: game state, timer, scoring,
// hints, levels and the start / level-clear / win overlays.
// Three original scenes, six differences each, against the clock.
// A wrong click costs 5 seconds; a hint costs 15 points and shows
// one unfound difference for a moment.
import { LEVELS } from "./scenes.js";
import { SoundBank } from "./audio.js";
import { renderPanels, formatTime } from "./render.js";
import { scenePoint, nearestDiff, bindKeyboard } from "./input.js";
import { applyShot } from "./shots.js";

const $ = (id) => document.getElementById(id);

class Game {
  constructor() {
    this.leftCtx = $("leftCanvas").getContext("2d");
    this.rightCtx = $("rightCanvas").getContext("2d");
    this.sounds = new SoundBank();
    this.levelIndex = 0;
    this.level = LEVELS[0];
    this.found = [];
    this.hint = null;
    this.flash = null;
    this.score = 0;
    this.hintsLeft = 3;
    this.timeLeft = this.level.timeSec;
    this.running = false;
    this.paused = false;
    this.overlayVisible = true;
    this.lastTick = 0;
    this.lowWarned = false;
    this.bind();
    bindKeyboard(this);
    this.showOverlay("Lantern Lane", "Two pictures of the same quiet street — but six things changed between them. Find all six before the clock runs out. Three scenes, each harder than the last.", "Start playing");
    this.render();
  }
  bind() {
    for (const canvas of [$("leftCanvas"), $("rightCanvas")]) {
      canvas.addEventListener("click", (e) => this.click(scenePoint(e, canvas)));
    }
    $("hintBtn").addEventListener("click", () => this.useHint());
    $("soundBtn").addEventListener("click", () => {
      this.sounds.enabled = !this.sounds.enabled;
      $("soundBtn").textContent = this.sounds.enabled ? "Sound: on" : "Sound: off";
    });
    $("pauseBtn").addEventListener("click", () => this.togglePause());
    $("overlayBtn").addEventListener("click", () => this.overlayButton());
  }
  get state() { return { level: this.level, leftCtx: this.leftCtx, rightCtx: this.rightCtx, found: this.found, hint: this.hint, flash: this.flash }; }
  render() { renderPanels(this.state); this.hud(); }
  hud() {
    $("levelLabel").textContent = this.level.name;
    const remain = this.level.diffs.length - this.found.length;
    $("counter").textContent = `Found ${this.found.length} / ${this.level.diffs.length} · ${remain} remain`;
    $("timer").textContent = formatTime(this.timeLeft);
    $("timer").classList.toggle("low", this.timeLeft <= 15 && this.running);
    $("score").textContent = `Score ${this.score} · Hints ${this.hintsLeft}`;
    $("hintBtn").textContent = `Hint (H) · ${this.hintsLeft} left`;
  }
  showOverlay(title, text, button) {
    $("overlayTitle").textContent = title; $("overlayText").textContent = text;
    $("overlayBtn").textContent = button;
    $("overlay").classList.remove("hidden"); this.overlayVisible = true;
  }
  hideOverlay() { $("overlay").classList.add("hidden"); this.overlayVisible = false; }
  overlayButton() {
    if (this.paused) return this.togglePause();
    if (!this.running) {
      this.hideOverlay();
      if (this.levelIndex >= LEVELS.length) { this.score = 0; this.startLevel(0); }
      else this.startLevel(this.levelIndex);
    } else this.hideOverlay();
  }
  startLevel(i) {
    this.levelIndex = i; this.level = LEVELS[i];
    this.found = []; this.hint = null; this.flash = null; this.hintsLeft = 3;
    this.timeLeft = this.level.timeSec; this.running = true; this.paused = false; this.lowWarned = false;
    this.lastTick = performance.now();
    this.setMessage(`Find all ${this.level.diffs.length} differences in ${this.level.name}.`);
    this.render(); requestAnimationFrame((t) => this.tick(t));
  }
  restartLevel() { if (this.running || this.paused) { this.startLevel(this.levelIndex); } }
  togglePause() {
    if (!this.running && !this.paused) return;
    this.paused = !this.paused;
    if (this.paused) { this.showOverlay("Paused", "Take a breath — the clock is stopped. Press P or the button to carry on hunting.", "Resume"); }
    else { this.hideOverlay(); this.lastTick = performance.now(); requestAnimationFrame((t) => this.tick(t)); }
  }
  tick(now) {
    if (!this.running || this.paused) return;
    const dt = (now - this.lastTick) / 1000; this.lastTick = now;
    this.timeLeft -= dt;
    if (this.timeLeft <= 15 && !this.lowWarned) { this.lowWarned = true; this.sounds.tick(); }
    if (this.timeLeft <= 0) { this.timeLeft = 0; this.render(); return this.timeUp(); }
    this.hud(); requestAnimationFrame((t) => this.tick(t));
  }
  timeUp() {
    this.running = false;
    this.sounds.wrong();
    const remain = this.level.diffs.length - this.found.length;
    this.showOverlay("Out of time", `The clock ran out with ${remain} difference${remain === 1 ? "" : "s"} still hiding in ${this.level.name}. Try the level again — the differences are fair, not obvious.`, "Try again");
  }
  click(point) {
    if (!this.running || this.paused) return;
    const diff = nearestDiff(point, this.level.diffs, this.found);
    if (diff) {
      this.found.push(diff); this.flash = null; this.hint = null;
      this.score += 100; this.sounds.found();
      this.setMessage(`Found it — ${diff.label}! ${this.level.diffs.length - this.found.length} remain.`);
      if (this.found.length === this.level.diffs.length) return this.levelClear();
    } else {
      this.flash = point; this.timeLeft = Math.max(0, this.timeLeft - 5);
      this.sounds.wrong();
      this.setMessage("Not quite — that costs 5 seconds. Look closer at the small things.");
      setTimeout(() => { this.flash = null; if (this.running) this.render(); }, 450);
    }
    this.render();
  }
  useHint() {
    if (!this.running || this.paused) return;
    if (this.hintsLeft <= 0) { this.setMessage("No hints left on this level."); return; }
    const rest = this.level.diffs.filter((d) => !this.found.includes(d));
    if (!rest.length) return;
    this.hintsLeft--; this.score = Math.max(0, this.score - 15);
    this.hint = rest[Math.floor(Math.random() * rest.length)];
    this.sounds.hint();
    this.setMessage("Hint: look inside the gold ring — one difference is hiding there.");
    this.render();
    setTimeout(() => { this.hint = null; if (this.running) this.render(); }, 1600);
  }
  levelClear() {
    this.score += Math.round(this.timeLeft) * 2;
    this.render();
    if (this.levelIndex + 1 < LEVELS.length) {
      this.sounds.levelWin(); this.running = false;
      this.showOverlay("Level clear!", `All ${this.level.diffs.length} differences found in ${this.level.name}. Score ${this.score}. The next scene hides its differences better — and the clock is shorter.`, "Next level");
      this.levelIndex += 1;
    } else {
      this.sounds.gameWin(); this.running = false; this.levelIndex = LEVELS.length;
      this.showOverlay("You found them all!", `Every difference in all three scenes — ${LEVELS.reduce((n, l) => n + l.diffs.length, 0)} in total. Final score ${this.score}. Lantern Lane is yours.`, "Play again");
    }
  }
  setMessage(text) { $("message").textContent = text; }
}

const game = new Game();
applyShot(game);
window.__game = game;
