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

const videoPreviews = document.querySelectorAll("[data-video-id]");

videoPreviews.forEach((preview) => {
  const videoId = preview.dataset.videoId;
  const shouldEmbed = preview.dataset.embed !== "false";

  if (!shouldEmbed) {
    return;
  }

  const playVideo = () => {
    if (!videoId || preview.classList.contains("is-playing")) {
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
    iframe.title = "YouTube video";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.loading = "lazy";

    preview.innerHTML = "";
    preview.appendChild(iframe);
    preview.classList.add("is-playing");
  };

  const playButton = preview.querySelector(".video-play");
  if (playButton) {
    playButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      playVideo();
    });
  }

  preview.addEventListener("click", playVideo);
});

const newsToggle = document.querySelector("[data-news-toggle]");
const moreNews = document.querySelector("#more-news");

if (newsToggle && moreNews) {
  newsToggle.addEventListener("click", () => {
    const isExpanded = newsToggle.getAttribute("aria-expanded") === "true";
    newsToggle.setAttribute("aria-expanded", String(!isExpanded));
    if (isExpanded) {
      moreNews.hidden = true;
    } else {
      moreNews.hidden = false;
      moreNews.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}
