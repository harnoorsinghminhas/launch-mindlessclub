/* mindlessclub.com sign-up: email first. Sends exactly the fields the hub page sends. */
(function () {
  "use strict";
  var API = "https://acp9reat3l.execute-api.us-east-1.amazonaws.com/signal/request-link";
  var SITE = "mindlessclub.com";
  var LANDING_RE = /^\/[A-Za-z0-9._~!$&'()*+,;=:@%\/-]{0,199}$/;
  var EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[A-Za-z]{2,}$/;
  function validEmail(v) { return v.length <= 254 && EMAIL_RE.test(v); }
  function payload(email, hp) {
    var b = { email: email, hp: hp || "", site: SITE };
    if (LANDING_RE.test(location.pathname)) b.landing_path = location.pathname;
    try { var tz = Intl.DateTimeFormat().resolvedOptions().timeZone; if (tz && tz.length <= 40) b.tz = tz; } catch (e) { /* the API falls back */ }
    var q = location.search;
    if (q && q.length <= 2048 && /[?&](utm_[a-z]+|ref)=/i.test(q)) b.query = q;
    return b;
  }
  function post(body) {
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = ctl ? window.setTimeout(function () { ctl.abort(); }, 15000) : 0;
    return fetch(API, { method: "POST", mode: "cors", credentials: "omit", cache: "no-store", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: ctl ? ctl.signal : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { window.clearTimeout(timer); return { status: r.status, code: j && j.error }; }); },
            function () { window.clearTimeout(timer); return { status: 0, code: "network" }; });
  }
  function errText(res) {
    var s = res.status;
    if (s === 400 && res.code === "invalid_email") return "That email address doesn't look right. Check it for a typo?";
    if (s === 400) return "Something in the form didn't go through. Please try again.";
    if (s === 415) return "Your browser sent the form in a format we can't read. Refresh and try again.";
    if (s === 429) return "Lots of sign-ups from your network just now. Wait a minute, then try again.";
    if (s === 403) return "Sign-up only works on our own site. Open mindlessclub.com and try again.";
    if (s >= 500) return "Our sign-up desk hit a snag. Please try again in a moment.";
    return "We couldn't reach the sign-up desk. Check your connection and try again.";
  }
  var forms = document.querySelectorAll(".js-join");
  Array.prototype.forEach.call(forms, function (form) {
    var em = form.querySelector('input[type="email"]');
    var hp = form.querySelector('input[name="website"]');
    var err = form.querySelector(".js-err");
    var btn = form.querySelector('button[type="submit"]');
    var done = form.parentNode.querySelector(".js-done");
    var busy = false;
    em.addEventListener("blur", function () {
      var v = em.value.trim();
      if (v && !validEmail(v)) { err.textContent = "That email address doesn't look right yet."; em.setAttribute("aria-invalid", "true"); }
      else { err.textContent = ""; em.removeAttribute("aria-invalid"); }
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return;
      var v = em.value.trim();
      if (!validEmail(v)) { err.textContent = "Please enter your email address, like name@example.com."; em.setAttribute("aria-invalid", "true"); em.focus(); return; }
      busy = true; btn.disabled = true;
      var label = btn.textContent; btn.textContent = "Sending…"; err.textContent = "";
      post(payload(v, hp ? hp.value : "")).then(function (res) {
        busy = false; btn.disabled = false; btn.textContent = label;
        if (res.status === 200) {
          form.hidden = true;
          if (done) { done.hidden = false; var b = done.querySelector(".js-addr"); if (b) b.textContent = v; var hd = done.querySelector("h3"); if (hd) hd.focus(); }
          return;
        }
        err.textContent = errText(res);
        if (res.code === "invalid_email") { em.setAttribute("aria-invalid", "true"); em.focus(); }
      });
    });
  });
})();
