/* Put the day down: five cards, read one and let it go. Nothing is stored or sent. */
(function () {
  "use strict";
  var cards = [
    "Your inbox can wait until morning.",
    "Whatever you did not finish is still there, and it will keep.",
    "A machine is thinking about it now. You do not have to.",
    "You were enough today, with or without the list.",
    "Breathe out, slower than you breathed in. That is all."
  ];
  var i = 0;
  var card = document.getElementById("card");
  var go = document.getElementById("letgo");
  var count = document.getElementById("count");
  if (!card || !go) return;
  go.addEventListener("click", function () {
    card.classList.add("gone");
    window.setTimeout(function () {
      i += 1;
      if (i >= cards.length) {
        card.textContent = "The day is down. Goodnight.";
        go.textContent = "Start again";
        count.textContent = "Done";
        i = -1;
      } else {
        card.textContent = cards[i];
        go.textContent = "Let it go";
        count.textContent = (i + 1) + " of " + cards.length;
      }
      card.classList.remove("gone");
    }, 450);
  });
})();
