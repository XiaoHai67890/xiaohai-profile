const languageToggle = document.querySelector("#languageToggle");
const translatedNodes = document.querySelectorAll("[data-zh][data-en]");
const yearNode = document.querySelector("#year");
const loader = document.querySelector("#loader");
const ethParticles = document.querySelector("#ethParticles");
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const sections = Array.from(document.querySelectorAll("[data-section]"));
const revealNodes = Array.from(document.querySelectorAll(".reveal"));
const pageShell = document.querySelector(".cosmic-shell");

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const savedLanguage = localStorage.getItem("xiaohai-language");
let currentLanguage = savedLanguage === "en" ? "en" : "zh";
let currentPage = 0;
let isPaging = false;
let touchStartY = 0;
let touchStartX = 0;
let touchStartScrollTop = 0;
let touchSection = null;
let touchStartedInNav = false;

function applyLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";

  translatedNodes.forEach((node) => {
    node.textContent = node.dataset[language];
  });

  languageToggle.textContent = language === "zh" ? "EN" : "中文";
  languageToggle.setAttribute(
    "aria-label",
    language === "zh" ? "Switch to English" : "切换到中文"
  );

  localStorage.setItem("xiaohai-language", language);
}

function createLoaderParticles() {
  const count = 190;
  const spread = Math.max(window.innerWidth, window.innerHeight) * 0.72;
  const logoFaces = [
    [[60, 0], [0, 98], [60, 70]],
    [[60, 0], [120, 98], [60, 70]],
    [[0, 98], [60, 132], [60, 70]],
    [[120, 98], [60, 132], [60, 70]],
    [[0, 110], [60, 196], [60, 144]],
    [[120, 110], [60, 196], [60, 144]],
  ];
  const colors = [
    "rgba(246, 248, 255, 0.98)",
    "rgba(143, 255, 235, 0.98)",
    "rgba(98, 126, 234, 0.98)",
    "rgba(49, 215, 255, 0.98)",
  ];

  function sampleTriangle(points) {
    let a = Math.random();
    let b = Math.random();
    if (a + b > 1) {
      a = 1 - a;
      b = 1 - b;
    }

    const c = 1 - a - b;
    return [
      points[0][0] * a + points[1][0] * b + points[2][0] * c,
      points[0][1] * a + points[1][1] * b + points[2][1] * c,
    ];
  }

  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement("span");
    const [startX, startY] = sampleTriangle(logoFaces[index % logoFaces.length]);
    const angle = (Math.PI * 2 * index) / count + (Math.random() - 0.5) * 0.35;
    const distance = spread * (0.48 + Math.random() * 0.85);
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    const size = 1.8 + Math.random() * 4.2;

    particle.style.setProperty("--sx", `${((startX / 120) * 100).toFixed(2)}%`);
    particle.style.setProperty("--sy", `${((startY / 196) * 100).toFixed(2)}%`);
    particle.style.setProperty("--tx", `${tx.toFixed(1)}px`);
    particle.style.setProperty("--ty", `${ty.toFixed(1)}px`);
    particle.style.setProperty("--size", `${size.toFixed(1)}px`);
    particle.style.setProperty("--particle-color", colors[index % colors.length]);
    particle.style.animationDelay = `${Math.random() * 0.36}s`;
    ethParticles.appendChild(particle);
  }
}

function runLoader() {
  createLoaderParticles();

  window.setTimeout(() => {
    loader.classList.add("disperse");
  }, 900);

  window.setTimeout(() => {
    loader.classList.add("is-hidden");
    document.body.classList.remove("is-loading");
    setPage(getInitialPage(), { animate: false, updateHash: false });
  }, 2600);

  window.setTimeout(() => {
    loader.remove();
  }, 3450);
}

function startStarfield() {
  const canvas = document.querySelector("#starfield");
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let stars = [];
  let mouseX = 0;
  let mouseY = 0;

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.min(280, Math.floor((width * height) / 4600));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: 0.35 + Math.random() * 1.4,
      size: 0.55 + Math.random() * 1.35,
      twinkle: Math.random() * Math.PI * 2,
      hue: Math.random() > 0.72 ? "143,255,235" : "160,176,255",
    }));
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(3, 7, 18, 0.34)";
    ctx.fillRect(0, 0, width, height);

    const driftX = (mouseX - width / 2) * 0.012;
    const driftY = (mouseY - height / 2) * 0.012;

    stars.forEach((star) => {
      star.y += star.z * 0.045;
      if (star.y > height + 8) {
        star.y = -8;
        star.x = Math.random() * width;
      }

      const alpha = 0.36 + Math.sin(time * 0.0015 + star.twinkle) * 0.3;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${star.hue}, ${Math.max(0.18, alpha)})`;
      ctx.arc(star.x + driftX * star.z, star.y + driftY * star.z, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    for (let index = 0; index < stars.length; index += 1) {
      const a = stars[index];
      for (let other = index + 1; other < stars.length; other += 1) {
        const b = stars[other];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < 84) {
          ctx.strokeStyle = `rgba(143,255,235,${(1 - distance / 84) * 0.075})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x + driftX * a.z, a.y + driftY * a.z);
          ctx.lineTo(b.x + driftX * b.z, b.y + driftY * b.z);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  resize();
  requestAnimationFrame(draw);
}

function setupReveal() {
  sections.forEach((section) => {
    const nodes = Array.from(section.querySelectorAll(".reveal"));
    nodes.forEach((node, index) => {
      node.style.setProperty("--delay", `${Math.min(index * 95, 570)}ms`);
    });
  });
}

function getPageHeight() {
  const headerHeight = document.querySelector(".site-header").offsetHeight;
  const pageHeight = window.innerHeight - headerHeight;
  document.documentElement.style.setProperty("--header-h", `${headerHeight}px`);
  document.documentElement.style.setProperty("--page-h", `${pageHeight}px`);
  return pageHeight;
}

function getInitialPage() {
  if (!window.location.hash) return 0;

  const targetIndex = sections.findIndex((section) => `#${section.id}` === window.location.hash);
  return targetIndex === -1 ? 0 : targetIndex;
}

function revealPage(index) {
  sections[index].querySelectorAll(".reveal").forEach((node) => {
    node.classList.add("is-visible");
  });
}

function updateActiveNav() {
  const activeId = sections[currentPage].id;
  const navId = ["repos", "more-repos"].includes(activeId) ? "projects" : activeId;
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${navId}`);
  });
}

function setPage(index, options = {}) {
  const { animate = true, updateHash = true } = options;
  const previousPage = currentPage;
  currentPage = Math.max(0, Math.min(index, sections.length - 1));
  pageShell.scrollTop = 0;
  pageShell.scrollLeft = 0;

  const pageY = -currentPage * getPageHeight();
  document.documentElement.style.setProperty("--page-y", `${pageY}px`);
  document.body.classList.toggle("is-instant-page", !animate);

  sections.forEach((section, sectionIndex) => {
    section.classList.toggle("is-page-active", sectionIndex === currentPage);
  });

  if (previousPage !== currentPage) {
    sections[currentPage].scrollTop = 0;
  }

  revealPage(currentPage);
  updateActiveNav();

  if (updateHash) {
    history.replaceState(null, "", `#${sections[currentPage].id}`);
  }

  if (!animate) {
    requestAnimationFrame(() => {
      document.body.classList.remove("is-instant-page");
    });
  }
}

function queuePageTurn(direction) {
  if (document.body.classList.contains("is-loading") || isPaging) return;

  const nextPage = Math.max(0, Math.min(currentPage + direction, sections.length - 1));
  if (nextPage === currentPage) return;

  isPaging = true;
  setPage(nextPage);
  window.setTimeout(() => {
    isPaging = false;
  }, 850);
}

function getEventSection(target) {
  const matchedSection = target?.closest?.("[data-section]");
  return matchedSection === sections[currentPage] ? matchedSection : sections[currentPage];
}

function canScrollSection(section, direction, scrollTop = section.scrollTop) {
  if (!section) return false;

  const scrollableHeight = section.scrollHeight - section.clientHeight;
  if (scrollableHeight <= 4) return false;

  if (direction > 0) {
    return scrollTop < scrollableHeight - 4;
  }

  return scrollTop > 4;
}

function setupPageNavigation() {
  window.addEventListener(
    "wheel",
    (event) => {
      if (event.ctrlKey) return;

      const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (Math.abs(delta) < 22) return;

      const direction = delta > 0 ? 1 : -1;
      const section = getEventSection(event.target);
      if (canScrollSection(section, direction)) return;

      event.preventDefault();
      queuePageTurn(direction);
    },
    { passive: false }
  );

  window.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
      touchSection = getEventSection(event.target);
      touchStartScrollTop = touchSection?.scrollTop || 0;
      touchStartedInNav = Boolean(event.target?.closest?.(".site-header"));
    },
    { passive: true }
  );

  window.addEventListener(
    "touchend",
    (event) => {
      if (touchStartedInNav) return;

      const deltaX = touchStartX - event.changedTouches[0].clientX;
      const deltaY = touchStartY - event.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 52 || Math.abs(deltaY) < Math.abs(deltaX) * 1.18) return;

      const direction = deltaY > 0 ? 1 : -1;
      if (canScrollSection(touchSection, direction, touchStartScrollTop)) return;

      queuePageTurn(direction);
    },
    { passive: true }
  );

  window.addEventListener("keydown", (event) => {
    if (["ArrowDown", "PageDown", " "].includes(event.key)) {
      event.preventDefault();
      queuePageTurn(1);
    }

    if (["ArrowUp", "PageUp"].includes(event.key)) {
      event.preventDefault();
      queuePageTurn(-1);
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetIndex = sections.findIndex((section) => `#${section.id}` === anchor.getAttribute("href"));
      if (targetIndex === -1) return;

      event.preventDefault();
      setPage(targetIndex);
    });
  });

  window.addEventListener("resize", () => {
    setPage(currentPage, { animate: false, updateHash: false });
  });

  window.addEventListener("hashchange", () => {
    setPage(getInitialPage(), { animate: true, updateHash: false });
  });
}

languageToggle.addEventListener("click", () => {
  applyLanguage(currentLanguage === "zh" ? "en" : "zh");
});

yearNode.textContent = new Date().getFullYear();
applyLanguage(currentLanguage);
setupReveal();
setupPageNavigation();
startStarfield();
runLoader();
