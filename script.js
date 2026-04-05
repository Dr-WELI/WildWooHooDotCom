const showreelImages = [
  "assets/showreel-01.jpg",
  "assets/showreel-02.jpg",
  "assets/showreel-03.jpg",
  "assets/showreel-04.jpg",
  "assets/showreel-05.jpg",
  "assets/showreel-06.jpg"
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

  const imagesToUse = showreelImages.length ? showreelImages : [];

  for (let repeat = 0; repeat < 2; repeat++) {
    imagesToUse.forEach((src, index) => {
      const sizeClass = pattern[index % pattern.length] || "";
      track.appendChild(makeCard(src, sizeClass));
    });
  }
}

populateTrack("trackA", ["large", "", "small", "", "large", ""]);
populateTrack("trackB", ["", "small", "large", "", "small", ""]);

document.getElementById("year")?.remove();
