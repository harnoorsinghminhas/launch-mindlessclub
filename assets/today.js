/* "Today": picks one timeless entry by day of year, so the page is fresh every day with no updates.
   Entries rotate through a fixed list; textContent only (no innerHTML), so the page runs under require-trusted-types-for 'script'. */
(function () {
"use strict";
var ENTRIES = [["Three slow breaths", "Before you open anything today, breathe out slowly three times. Let each out-breath be a little longer than the one before."], ["Feet on the floor", "Sit and feel both feet pressing down. Stay with that for one minute. There is nothing to fix."], ["Wash your hands slowly", "Notice the warmth of the water, the soap, the small sounds. Let that be the whole task."], ["Follow one sound", "Choose a single sound in the room and follow it until it fades, or until you drift. Then choose another."], ["A screen-free cup", "Drink one warm drink today without a phone in your hand. Taste it. Notice when it is half gone."], ["Ten out-breaths", "Count ten breaths out. After the tenth, stop counting and just breathe."], ["Look out of a window", "Find the farthest thing you can see and rest your eyes on it for a full minute."], ["A slower walk", "Walk a short stretch at half your usual speed. Feel each step arrive and leave."], ["A short body scan", "Move your attention from the top of your head to your toes, resting a few seconds in each place."], ["Two minutes of nothing", "Sit. No audio, no list. If a thought comes, let it pass like a car on a distant road."], ["Five, four, three", "Name five things you can see, four you can hear, three you can feel. Say them slowly, in your head."], ["Soften the jaw", "Unclench your jaw, drop your shoulders, loosen your hands. Breathe out once more."], ["An evening handover", "Before bed, put the day down. Say once, quietly: that is enough for today."], ["Wait one breath", "Before you answer the next message, wait one full breath. See what changes."], ["Mood as weather", "Notice the mood you are in as if it were weather: passing through, not permanent."], ["One ordinary thing", "Pick one ordinary object near you and notice why you are glad to have it."]];
var t = document.getElementById("today-t"), b = document.getElementById("today-b"), n = document.getElementById("today-n"), d = document.getElementById("today-date");
if (!t || !b || !ENTRIES.length) return;
var now = new Date();
var doy = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(now.getFullYear(), 0, 0)) / 86400000);
var i = doy % ENTRIES.length;
t.textContent = ENTRIES[i][0];
b.textContent = ENTRIES[i][1];
if (n) n.textContent = "Entry " + (i + 1) + " of " + ENTRIES.length + ". A new one every day.";
if (d) { try { d.textContent = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }); } catch (e) { /* keep the default label */ } }
})();
