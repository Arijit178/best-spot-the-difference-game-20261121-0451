// Sounds: everything is synthesised with WebAudio, so the game needs
// no sound files and makes no network request.
export class SoundBank {
  constructor() { this.ctx = null; this.enabled = true; }
  ensure() {
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { this.ctx = null; }
    }
    if (this.ctx && this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }
  tone(freq, dur, type = "sine", gain = 0.12, when = 0) {
    if (!this.enabled) return;
    const ctx = this.ensure(); if (!ctx) return;
    const t = ctx.currentTime + when;
    const osc = ctx.createOscillator(); const amp = ctx.createGain();
    osc.type = type; osc.frequency.value = freq;
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(gain, t + 0.02);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(amp); amp.connect(ctx.destination);
    osc.start(t); osc.stop(t + dur + 0.05);
  }
  found() { this.tone(660, 0.14, "sine", 0.14); this.tone(990, 0.22, "sine", 0.12, 0.09); }
  wrong() { this.tone(160, 0.18, "sawtooth", 0.07); }
  hint() { this.tone(520, 0.12, "triangle", 0.1); this.tone(780, 0.16, "triangle", 0.09, 0.08); }
  levelWin() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.22, "sine", 0.12, i * 0.11)); }
  gameWin() { [523, 659, 784, 1047, 1319].forEach((f, i) => this.tone(f, 0.3, "sine", 0.12, i * 0.13)); }
  tick() { this.tone(880, 0.06, "sine", 0.05); }
}
