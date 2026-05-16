/* WildWooHoo — splash hero showreel
   Absolute paths (so subpages work) + per-page deck via body[data-deck].
   Each deck is 4 images that get populated into the two showreel tracks. */

const SHOWREEL_DECKS = {
  // Default / home — the original splash four
  home: [
    "/assets/img/03-kangaroo-weli.jpg",
    "/assets/img/02-photoshoot-weli.jpg",
    "/assets/img/01-group-weli.jpg",
    "/assets/img/04-leaping-weli.jpg"
  ],
  // Music & Video — KT video photography
  music: [
    "/assets/img/20231015_KangarooTime-ballet02424.jpg",
    "/assets/img/20231015_KangarooTime-dragqueen02359.jpg",
    "/assets/img/20231015_KangarooTime-samba02219.jpg",
    "/assets/img/20231015_KangarooTime-groupallmodels02246-2.jpg"
  ],
  // Educational — kids events + animation stills
  educational: [
    "/assets/img/KT%20kids%20event1.jpg",
    "/assets/img/Animation-Kanga-Kangaroo-homecover.jpg",
    "/assets/img/KT%20kids%20event2.jpg",
    "/assets/img/Animation-Kanga-Kangaroo-listcharacter.jpg"
  ],
  // Projects — across project visuals
  projects: [
    "/assets/img/20231015_KangarooTime-videocover02293.jpg",
    "/assets/img/Animation-Kanga-Kangaroo.jpg",
    "/assets/img/man-longhair-goldenhour.jpg",
    "/assets/img/04-leaping-weli.jpg"
  ],
  // Impact — animal-behaviour photography
  impact: [
    "/assets/img/kangaroo-playfight.jpg",
    "/assets/img/human-group-models-playingkangaroogroup.jpg",
    "/assets/img/kangaroo_silhuette-sunset.jpg",
    "/assets/img/kangaroo-hogdeer-encounter.jpg"
  ]
};

function getShowreelImages() {
  const deck = (document.body && document.body.dataset && document.body.dataset.deck) || "home";
  return SHOWREEL_DECKS[deck] || SHOWREEL_DECKS.home;
}

function makeCard(src, sizeClass = "") {
  const item = document.createElement("div");
  item.className = `showreel-item ${sizeClass}`.trim();

  const img = document.createElement("img");
  img.src = src;
  img.alt = "";
  img.loading = "eager";

  item.appendChild(img);
  return item;
}

function populateTrack(trackId, pattern = []) {
  const track = document.getElementById(trackId);
  if (!track) return;
  const images = getShowreelImages();

  for (let repeat = 0; repeat < 3; repeat++) {
    images.forEach((src, index) => {
      const sizeClass = pattern[index % pattern.length] || "";
      track.appendChild(makeCard(src, sizeClass));
    });
  }
}

populateTrack("trackA", ["large", "", "small", "", "large"]);
populateTrack("trackB", ["", "small", "large", "", "small"]);
