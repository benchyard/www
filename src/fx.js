// Runs before the page is first drawn, so that what moves is laid out for it
// from the start and nothing is shown and then taken away. It only marks the
// page; src/site.js does the rest. If that never arrives, the mark is taken
// off again and every part is simply in its place.
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const page = document.documentElement;
  page.classList.add("fx");
  setTimeout(() => page.dataset.site || page.classList.remove("fx"), 4000);
}
