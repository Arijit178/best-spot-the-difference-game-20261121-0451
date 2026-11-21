// Input: mouse clicks on either canvas, and the keyboard. A click is
// mapped from the canvas's displayed size back to scene coordinates,
// then tested against the level's unfound differences.
export function scenePoint(event, canvas) {
  const r = canvas.getBoundingClientRect();
  const x = ((event.clientX - r.left) / r.width) * canvas.width;
  const y = ((event.clientY - r.top) / r.height) * canvas.height;
  return { x, y };
}

export function nearestDiff(point, diffs, found) {
  let best = null; let bestDist = Infinity;
  for (const d of diffs) {
    if (found.includes(d)) continue;
    const dist = Math.hypot(point.x - d.x, point.y - d.y);
    if (dist < bestDist) { bestDist = dist; best = d; }
  }
  return best && bestDist <= Math.max(best.r, 26) ? best : null;
}

export function bindKeyboard(game) {
  window.addEventListener("keydown", (event) => {
    if (event.key === "h" || event.key === "H") game.useHint();
    else if (event.key === "p" || event.key === "P" || event.key === "Escape") game.togglePause();
    else if (event.key === "r" || event.key === "R") game.restartLevel();
    else if (event.key === "Enter" && game.overlayVisible) game.overlayButton();
  });
}
