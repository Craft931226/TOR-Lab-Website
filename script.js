const navLinks = Array.from(document.querySelectorAll(".nav a"));
const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href")));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      const link = navLinks.find((a) => a.getAttribute("href") === `#${id}`);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach((a) => a.classList.remove("is-active"));
        link.classList.add("is-active");
      }
    });
  },
  { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
);

sections.forEach((section) => observer.observe(section));

const contactButton = document.querySelector(".contact-form .btn");
if (contactButton) {
  contactButton.addEventListener("click", () => {
    alert("Thanks for reaching out! Replace this with your form handler.");
  });
}
