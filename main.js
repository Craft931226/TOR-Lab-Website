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
}

const currentPage = (() => {
  const path = window.location.pathname.split("/").pop();
  return path === "" ? "index.html" : path;
})();

linkItems.forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentPage) {
    link.classList.add("is-active");
  }
});
