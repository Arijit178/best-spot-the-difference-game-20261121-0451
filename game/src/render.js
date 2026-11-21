// Render: draws both panels, the found markers, hint rings and the
// wrong-click flash, from the game state. Markers are drawn on both
// panels at the same scene coordinates, so a found difference is
// circled on the left and on the right.
import { drawLevel } from "./scenes.js";

export function renderPanels(state) {
  const level = state.level;
  drawLevel(state.leftCtx, level, false);
  drawLevel(state.rightCtx, level, true);
  for (const d of state.found) drawMarker(state.leftCtx, d, "#2f9a4a");
  for (const d of state.found) drawMarker(state.rightCtx, d, "#2f9a4a");
  if (state.hint) drawMarker(state.leftCtx, state.hint, "#ffd94a", true);
  if (state.hint) drawMarker(state.rightCtx, state.hint, "#ffd94a", true);
  if (state.flash) {
    const f = state.flash;
    for (const ctx of [state.leftCtx, state.rightCtx]) {
      ctx.strokeStyle = "#ff5a4a"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(f.x - 12, f.y - 12); ctx.lineTo(f.x + 12, f.y + 12);
      ctx.moveTo(f.x + 12, f.y - 12); ctx.lineTo(f.x - 12, f.y + 12); ctx.stroke();
    }
  }
}

function drawMarker(ctx, d, colour, dashed = false) {
  ctx.save();
  ctx.strokeStyle = colour; ctx.lineWidth = 4;
  if (dashed) ctx.setLineDash([8, 6]);
  ctx.beginPath(); ctx.arc(d.x, d.y, Math.max(d.r, 20), 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}

export function formatTime(sec) {
  const s = Math.max(0, Math.ceil(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
