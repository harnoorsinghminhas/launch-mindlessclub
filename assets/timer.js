/* The silent sit: a quiet timer that works today. Nothing is stored or sent. */
(function () {
  "use strict";
  var root = document.getElementById("sit");
  if (!root) return;
  var ring = root.querySelector(".ring");
  var clock = root.querySelector(".clock");
  var go = root.querySelector(".go");
  var state = root.querySelector(".state");
  var opts = root.querySelectorAll("[data-min]");
  var mins = 1, total = 60, left = 60, t = 0, running = false, endAt = 0;
  var C = 2 * Math.PI * 54;
  var arc = root.querySelector(".arc");
  arc.style.strokeDasharray = String(C);
  function fmt(s) { var m = Math.floor(s / 60), r = s % 60; return m + ":" + (r < 10 ? "0" : "") + r; }
  function draw() { clock.textContent = fmt(left); arc.style.strokeDashoffset = String(C * (1 - left / total)); }
  function stop(finished) {
    window.clearInterval(t); running = false; go.textContent = "Begin";
    ring.classList.remove("on");
    if (finished) { state.textContent = "Done. The machines kept thinking. You didn't have to."; left = total; draw(); if (navigator.vibrate) { try { navigator.vibrate(60); } catch (e) { /* optional */ } } }
    else { state.textContent = "Paused. Begin when you like."; }
  }
  function tick() {
    left = Math.max(0, Math.round((endAt - Date.now()) / 1000));
    draw();
    if (left <= 0) stop(true);
  }
  go.addEventListener("click", function () {
    if (running) { stop(false); return; }
    total = total || mins * 60; if (left <= 0) left = total;
    endAt = Date.now() + left * 1000; running = true;
    go.textContent = "Pause"; ring.classList.add("on"); state.textContent = "Nothing to do. Let the breath breathe itself.";
    t = window.setInterval(tick, 250);
  });
  Array.prototype.forEach.call(opts, function (b) {
    b.addEventListener("click", function () {
      if (running) stop(false);
      mins = parseInt(b.getAttribute("data-min"), 10); total = mins * 60; left = total;
      Array.prototype.forEach.call(opts, function (o) { o.setAttribute("aria-pressed", o === b ? "true" : "false"); });
      state.textContent = mins + (mins === 1 ? " minute" : " minutes") + " of nothing. Begin when you like.";
      draw();
    });
  });
  draw();
})();
