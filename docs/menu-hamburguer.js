function setupHamburgerMenu({ hamburgerBtnSelector, menuSelector }) {
  const hamburgerBtn = document.querySelector(hamburgerBtnSelector);
  const menu = document.querySelector(menuSelector);

  if (!hamburgerBtn || !menu) {
    console.warn("Hamburger button ou menu não encontrado!");
    return;
  }

  hamburgerBtn.addEventListener("click", () => {
    const isHidden = menu.hasAttribute("hidden");
    if (isHidden) {
      menu.removeAttribute("hidden");
      hamburgerBtn.setAttribute("aria-expanded", "true");
    } else {
      menu.setAttribute("hidden", "");
      hamburgerBtn.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("click", (e) => {
    if (!hamburgerBtn.contains(e.target) && !menu.contains(e.target)) {
      menu.setAttribute("hidden", "");
      hamburgerBtn.setAttribute("aria-expanded", "false");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupHamburgerMenu({
    hamburgerBtnSelector: "#hamburger-btn",
    menuSelector: "#menu-list",
  });
});

