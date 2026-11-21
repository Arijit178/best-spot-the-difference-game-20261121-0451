// Scenes: every level is one original picture, drawn twice on canvas.
// The right picture is the same scene with its differences applied:
// a colour changed, a small thing added or taken away. Each difference
// has a centre and a radius, used both to draw it and to test clicks.
export const PANEL_W = 560;
export const PANEL_H = 420;

function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  g.addColorStop(0, top); g.addColorStop(1, bottom);
  ctx.fillStyle = g; ctx.fillRect(0, 0, PANEL_W, PANEL_H);
}
function circle(ctx, x, y, r, colour) {
  ctx.fillStyle = colour; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}
function rect(ctx, x, y, w, h, colour) {
  ctx.fillStyle = colour; ctx.fillRect(x, y, w, h);
}
function bird(ctx, x, y, colour = "#2b2438") {
  ctx.strokeStyle = colour; ctx.lineWidth = 3; ctx.beginPath();
  ctx.moveTo(x - 12, y); ctx.quadraticCurveTo(x - 4, y - 9, x, y);
  ctx.quadraticCurveTo(x + 4, y - 9, x + 12, y); ctx.stroke();
}
function cloud(ctx, x, y, colour = "#f7e8d0") {
  ctx.fillStyle = colour;
  ctx.beginPath(); ctx.ellipse(x, y, 42, 16, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + 28, y + 6, 30, 13, 0, 0, Math.PI * 2); ctx.fill();
}
function house(ctx, x, y, w, h, wall, roof, lit) {
  rect(ctx, x, y, w, h, wall);
  ctx.fillStyle = roof; ctx.beginPath();
  ctx.moveTo(x - 8, y); ctx.lineTo(x + w / 2, y - 34); ctx.lineTo(x + w + 8, y); ctx.closePath(); ctx.fill();
  rect(ctx, x + w / 2 - 12, y + h - 34, 24, 34, "#4a2f22");
  ctx.fillStyle = lit ? "#ffd94a" : "#2b2438";
  ctx.fillRect(x + 12, y + 16, 22, 22); ctx.fillRect(x + w - 34, y + 16, 22, 22);
}
function tree(ctx, x, y, fruit) {
  rect(ctx, x - 6, y, 12, 54, "#5a3a22");
  circle(ctx, x, y - 18, 38, "#2f7a3d"); circle(ctx, x - 26, y + 2, 26, "#3a8a46"); circle(ctx, x + 26, y + 2, 26, "#2f7a3d");
  if (fruit) { circle(ctx, x - 18, y - 10, 6, "#e84a4a"); circle(ctx, x + 14, y - 26, 6, "#e84a4a"); circle(ctx, x + 22, y + 4, 6, "#e84a4a"); }
}
function boat(ctx, x, y, sail) {
  ctx.fillStyle = "#7a4a22"; ctx.beginPath();
  ctx.moveTo(x - 46, y); ctx.lineTo(x + 46, y); ctx.lineTo(x + 32, y + 18); ctx.lineTo(x - 32, y + 18); ctx.closePath(); ctx.fill();
  rect(ctx, x - 2, y - 52, 4, 52, "#5a3a22");
  ctx.fillStyle = sail; ctx.beginPath(); ctx.moveTo(x + 2, y - 50); ctx.lineTo(x + 2, y - 4); ctx.lineTo(x + 38, y - 4); ctx.closePath(); ctx.fill();
}
function lantern(ctx, x, y, colour) {
  ctx.strokeStyle = "#3a2a1a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y - 26); ctx.lineTo(x, y - 8); ctx.stroke();
  ctx.fillStyle = colour; ctx.beginPath(); ctx.ellipse(x, y + 8, 14, 18, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#ffd94a"; ctx.beginPath(); ctx.ellipse(x, y + 8, 6, 9, 0, 0, Math.PI * 2); ctx.fill();
}

function drawHarbour(ctx, right) {
  sky(ctx, "#f2a35e", "#5a3a7a");
  if (right) { circle(ctx, 90, 70, 26, "#f5ead6"); circle(ctx, 78, 62, 8, "#d8c8a8"); }
  else { circle(ctx, 90, 70, 30, "#ff8a3d"); circle(ctx, 90, 70, 46, "rgba(255,138,61,0.25)"); }
  cloud(ctx, 300, 60); cloud(ctx, 470, 44, "#e8c8a0");
  bird(ctx, 430, 90); bird(ctx, 470, 90); if (!right) bird(ctx, 505, 76);
  rect(ctx, 0, 250, PANEL_W, 170, "#1d4a6b");
  ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.fillRect(0, 268, PANEL_W, 3); ctx.fillRect(0, 300, PANEL_W, 2);
  // lighthouse
  rect(ctx, 52, 120, 34, 130, "#f5ead6"); rect(ctx, 52, 150, 34, 16, "#c0392b"); rect(ctx, 52, 196, 34, 16, "#c0392b");
  rect(ctx, 46, 100, 46, 22, "#2b2438");
  if (right) { ctx.fillStyle = "rgba(255,217,74,0.35)"; ctx.beginPath(); ctx.moveTo(92, 111); ctx.lineTo(210, 84); ctx.lineTo(210, 138); ctx.closePath(); ctx.fill(); circle(ctx, 69, 111, 7, "#ffd94a"); }
  house(ctx, 120, 210, 90, 62, "#e8b48a", "#8a3a2a", !right);
  house(ctx, 380, 200, 100, 72, "#d8c8a8", "#5a3a5a", true);
  boat(ctx, 300, 300, right ? "#3a6ad8" : "#d83a3a");
  boat(ctx, 480, 330, "#3a8a46");
  // dock and cat
  rect(ctx, 380, 350, 180, 16, "#6b4a2a");
  if (!right) { ctx.fillStyle = "#2b2438"; ctx.beginPath(); ctx.ellipse(430, 340, 16, 10, 0, 0, Math.PI * 2); ctx.fill(); circle(ctx, 444, 330, 8, "#2b2438"); }
  circle(ctx, 520, 260, 10, right ? "#2f9a4a" : "#d83a3a");
  ctx.fillStyle = "#f5ead6"; ctx.font = "italic 15px Georgia, serif";
  ctx.fillText("Harbour Dusk", 16, 400);
}

function drawMarket(ctx, right) {
  sky(ctx, "#1a1430", "#3a1a4a");
  circle(ctx, right ? 440 : 480, 64, 24, "#f5ead6");
  cloud(ctx, 120, 56, "#5a4a7a"); cloud(ctx, 320, 40, "#4a3a6a");
  rect(ctx, 0, 300, PANEL_W, 120, "#2a1a2a");
  // stalls
  rect(ctx, 40, 220, 130, 80, "#7a4a22");
  ctx.fillStyle = right ? "#3a6ad8" : "#d83a3a"; ctx.beginPath(); ctx.moveTo(30, 220); ctx.lineTo(180, 220); ctx.lineTo(168, 188); ctx.lineTo(42, 188); ctx.closePath(); ctx.fill();
  circle(ctx, 80, 260, 12, "#e84a4a"); circle(ctx, 110, 260, 12, "#ffd94a"); circle(ctx, 140, 260, 12, "#7ac74a");
  rect(ctx, 380, 210, 140, 90, "#5a3a5a");
  ctx.fillStyle = "#ffd94a"; ctx.fillRect(400, 230, 100, 34);
  ctx.fillStyle = "#241a38"; ctx.font = "bold 20px Georgia, serif";
  ctx.fillText(right ? "TEA  •" : "TEA", 420, 254);
  // lanterns across the lane
  ctx.strokeStyle = "#3a2a1a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 120); ctx.quadraticCurveTo(280, 170, 560, 110); ctx.stroke();
  lantern(ctx, 140, 150, right ? "#7ac74a" : "#e84a4a");
  lantern(ctx, 280, 162, "#ffd94a"); lantern(ctx, 420, 148, "#e84a8a");
  tree(ctx, 330, 260, !right);
  // bicycle
  ctx.strokeStyle = "#c9b8a3"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(90, 360, 22, 0, Math.PI * 2); ctx.stroke();
  if (!right) { ctx.beginPath(); ctx.arc(150, 360, 22, 0, Math.PI * 2); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(90, 360); ctx.lineTo(120, 330); ctx.lineTo(150, 360); ctx.stroke();
  ctx.fillStyle = "#f5ead6"; ctx.font = "italic 15px Georgia, serif";
  ctx.fillText("Lantern Market", 16, 400);
}

function drawGarden(ctx, right) {
  sky(ctx, "#a8d8f0", "#e8f5d8");
  circle(ctx, 480, 66, 30, "#ffd94a");
  cloud(ctx, 120, 60); cloud(ctx, 340, 48);
  rect(ctx, 0, 280, PANEL_W, 140, "#5a9a3d");
  // pond
  ctx.fillStyle = "#3a8ac7"; ctx.beginPath(); ctx.ellipse(140, 340, 110, 34, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#7ac7e8"; ctx.beginPath(); ctx.ellipse(140, 336, 80, 20, 0, 0, Math.PI * 2); ctx.fill();
  if (!right) { ctx.fillStyle = "#f5ead6"; ctx.beginPath(); ctx.ellipse(120, 338, 18, 11, 0, 0, Math.PI * 2); ctx.fill(); circle(ctx, 136, 332, 7, "#f5ead6"); }
  tree(ctx, 430, 240, !right);
  // bench
  rect(ctx, 300, 320, 110, 12, "#7a4a22"); rect(ctx, 306, 332, 10, 34, "#7a4a22"); rect(ctx, 394, 332, 10, 34, "#7a4a22");
  if (right) rect(ctx, 310, 306, 90, 14, "#e84a8a");
  // flowers
  const flowers = [[60, 300, "#e84a8a"], [200, 310, "#ffd94a"], [260, 300, "#e84a8a"], [500, 330, "#ffd94a"], [40, 360, "#ffd94a"]];
  for (const [x, y, c] of flowers) { circle(ctx, x, y, 9, right && x === 200 ? "#3a6ad8" : c); circle(ctx, x, y, 4, "#fff"); }
  // butterfly
  if (!right) { ctx.fillStyle = "#8a4ae8"; ctx.beginPath(); ctx.ellipse(220, 150, 12, 8, -0.5, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(236, 150, 12, 8, 0.5, 0, Math.PI * 2); ctx.fill(); }
  bird(ctx, 200, 90); if (!right) bird(ctx, 240, 78);
  ctx.fillStyle = "#2b2438"; ctx.font = "italic 15px Georgia, serif";
  ctx.fillText("The Old Garden", 16, 400);
}

export const LEVELS = [
  {
    id: "harbour", name: "Level 1 · Harbour Dusk", timeSec: 120,
    draw: drawHarbour,
    diffs: [
      { x: 90, y: 70, r: 34, label: "the sun turned into a moon" },
      { x: 505, y: 76, r: 22, label: "a gull flew away" },
      { x: 320, y: 278, r: 30, label: "the sail changed colour" },
      { x: 132, y: 238, r: 20, label: "a window went dark" },
      { x: 430, y: 338, r: 24, label: "the dock cat vanished" },
      { x: 520, y: 260, r: 18, label: "the buoy changed colour" },
    ],
  },
  {
    id: "market", name: "Level 2 · Lantern Market", timeSec: 105,
    draw: drawMarket,
    diffs: [
      { x: 105, y: 204, r: 30, label: "the awning changed colour" },
      { x: 140, y: 158, r: 24, label: "a lantern changed colour" },
      { x: 330, y: 230, r: 30, label: "the apples vanished from the tree" },
      { x: 150, y: 360, r: 26, label: "a bicycle wheel went missing" },
      { x: 450, y: 247, r: 24, label: "the tea sign gained a dot" },
      { x: 460, y: 64, r: 36, label: "the moon moved" },
    ],
  },
  {
    id: "garden", name: "Level 3 · The Old Garden", timeSec: 90,
    draw: drawGarden,
    diffs: [
      { x: 228, y: 150, r: 26, label: "a butterfly flew away" },
      { x: 200, y: 310, r: 18, label: "a flower changed colour" },
      { x: 128, y: 336, r: 26, label: "the duck left the pond" },
      { x: 430, y: 214, r: 30, label: "the tree lost its apples" },
      { x: 355, y: 313, r: 30, label: "a cushion appeared on the bench" },
      { x: 220, y: 84, r: 28, label: "a bird flew away" },
    ],
  },
];

export function drawLevel(ctx, level, right) {
  ctx.clearRect(0, 0, PANEL_W, PANEL_H);
  level.draw(ctx, right);
}
