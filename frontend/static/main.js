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

const AUTH_TOKEN_STORAGE_KEY = "goat_data_access_token";
const API_BASE = "https://poseidon.ihs.ncu.edu.tw:8443";
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

const parseApiError = async (response, fallbackMessage) => {
  try {
    const data = await response.json();
    if (typeof data?.detail === "string") {
      return data.detail;
    }
  } catch (error) {
    // Fall through to fallback message when response body is not valid JSON.
  }
  return fallbackMessage;
};

const renderDatasetList = (targetElement, datasets) => {
  targetElement.innerHTML = "";
  datasets.forEach((dataset) => {
    const listItem = document.createElement("li");
    listItem.classList.add("data-list-item");

    const title = document.createElement("h3");
    title.textContent = dataset.name;

    const description = document.createElement("p");
    description.textContent = dataset.description;

    const meta = document.createElement("p");
    meta.classList.add("data-meta");
    meta.textContent = `Updated: ${dataset.updated}`;

    const link = document.createElement("a");
    link.href = dataset.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open dataset";

    listItem.append(title, description, meta, link);
    targetElement.appendChild(listItem);
  });
};

const initDataPage = () => {
  const loginSection = document.querySelector("[data-login-section]");
  const contentSection = document.querySelector("[data-content-section]");
  const loginForm = document.querySelector("[data-login-form]");
  const statusElement = document.querySelector("[data-login-status]");
  const datasetList = document.querySelector("[data-dataset-list]");
  const userInfo = document.querySelector("[data-user-info]");
  const logoutButton = document.querySelector("[data-logout-button]");

  if (
    !loginSection ||
    !contentSection ||
    !loginForm ||
    !statusElement ||
    !datasetList ||
    !userInfo ||
    !logoutButton
  ) {
    return;
  }

  const setStatus = (message, isError = false) => {
    if (!message) {
      statusElement.hidden = true;
      statusElement.textContent = "";
      statusElement.classList.remove("is-error");
      return;
    }
    statusElement.hidden = false;
    statusElement.textContent = message;
    statusElement.classList.toggle("is-error", isError);
  };

  const showLogin = () => {
    loginSection.hidden = false;
    contentSection.hidden = true;
  };

  const showData = () => {
    loginSection.hidden = true;
    contentSection.hidden = false;
  };

  const loadProtectedData = async (token) => {
    const response = await fetch(`${API_BASE}/api/data`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(await parseApiError(response, "Unable to load protected data"));
    }
    return response.json();
  };

  const applyAuthenticatedState = (payload) => {
    const username = payload?.username ?? "User";
    const datasets = Array.isArray(payload?.datasets) ? payload.datasets : [];
    userInfo.textContent = `Signed in as ${username}`;
    renderDatasetList(datasetList, datasets);
    showData();
  };

  const restoreSession = async () => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!token) {
      showLogin();
      return;
    }

    setStatus("Checking saved session...");
    try {
      const payload = await loadProtectedData(token);
      applyAuthenticatedState(payload);
      setStatus("");
    } catch (error) {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      showLogin();
      setStatus("Session expired. Please sign in again.", true);
    }
  };

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "");
    if (!username || !password) {
      setStatus("Username and password are required.", true);
      return;
    }

    setStatus("Signing in...");
    try {
      const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!loginResponse.ok) {
        throw new Error(await parseApiError(loginResponse, "Sign in failed"));
      }

      const loginPayload = await loginResponse.json();
      const token = loginPayload?.access_token;
      if (!token) {
        throw new Error("Server did not return an access token");
      }

      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
      const protectedPayload = await loadProtectedData(token);
      applyAuthenticatedState(protectedPayload);
      setStatus("");
      loginForm.reset();
    } catch (error) {
      setStatus(error?.message || "Sign in failed", true);
    }
  });

  logoutButton.addEventListener("click", async () => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (token) {
      try {
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        // Ignore network errors on logout and clear client session anyway.
      }
    }

    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    datasetList.innerHTML = "";
    userInfo.textContent = "";
    showLogin();
    setStatus("Signed out.");
  });

  showLogin();
  restoreSession();
};

if (currentPage === "data.html") {
  initDataPage();
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
