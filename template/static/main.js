const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const linkItems = Array.from(document.querySelectorAll("[data-nav-links] a"));

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("is-open");
  });

  linkItems.forEach((link) =>
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
    })
  );

  document.addEventListener("click", (event) => {
    const target = event.target;
    const clickedToggle = navToggle.contains(target);
    const clickedMenu = navLinks.contains(target);
    if (!clickedToggle && !clickedMenu && navLinks.classList.contains("is-open")) {
      navLinks.classList.remove("is-open");
    }
  });
}

const currentPage = (() => {
  const path = window.location.pathname.split("/").pop();
  return path === "" ? "index.html" : path;
})();

const navAlias = {
  "upper-ocean-thermal-structure.html": "research.html",
};

let matched = false;

linkItems.forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentPage) {
    link.classList.add("is-active");
    matched = true;
  }
});

if (!matched && navAlias[currentPage]) {
  const target = navAlias[currentPage];
  const fallbackLink = linkItems.find((link) => link.getAttribute("href") === target);
  if (fallbackLink) {
    fallbackLink.classList.add("is-active");
  }
}
