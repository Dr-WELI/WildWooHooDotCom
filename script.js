const showreelImages = [
  "assets/img/03-kangaroo-weli.jpg",
  "assets/img/02-photoshoot-weli.jpg",
  "assets/img/01-group-weli.jpg",
  "assets/img/04-leaping-weli.jpg"
];

function makeCard(src, sizeClass = "") {
  const item = document.createElement("div");
  item.className = `showreel-item ${sizeClass}`.trim();

  const img = document.createElement("img");
  img.src = src;
  img.alt = "WildWooHoo showreel image";
  img.loading = "eager";

  item.appendChild(img);
  return item;
}

function populateTrack(trackId, pattern = []) {
  const track = document.getElementById(trackId);
  if (!track) return;

  for (let repeat = 0; repeat < 3; repeat++) {
    showreelImages.forEach((src, index) => {
      const sizeClass = pattern[index % pattern.length] || "";
      track.appendChild(makeCard(src, sizeClass));
    });
  }
}

populateTrack("trackA", ["large", "", "small", "", "large"]);
populateTrack("trackB", ["", "small", "large", "", "small"]);
