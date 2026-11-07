(() => {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (!reducedMotion.matches) entry.target.classList.add("ac-scroll-enter");
      }
    }, { threshold: 0.15 });

    document.querySelectorAll("section h2, main h2, .ac-intro h1").forEach(heading => {
      if (heading.getBoundingClientRect().top >= innerHeight) observer.observe(heading);
    });
  }

  const mouse = matchMedia("(hover: hover) and (pointer: fine)");
  const halo = document.createElement("div");
  halo.className = "ac-pointer-halo";
  halo.setAttribute("aria-hidden", "true");
  halo.hidden = true;
  document.body.append(halo);

  let frame = 0;
  let x = 0;
  let y = 0;
  function hideHalo() {
    cancelAnimationFrame(frame);
    frame = 0;
    halo.hidden = true;
  }
  document.addEventListener("pointermove", event => {
    if (event.pointerType !== "mouse" || !mouse.matches || reducedMotion.matches) {
      hideHalo();
      return;
    }
    x = event.clientX;
    y = event.clientY;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      halo.style.setProperty("--ac-pointer-x", `${x}px`);
      halo.style.setProperty("--ac-pointer-y", `${y}px`);
      halo.hidden = false;
    });
  }, { passive: true });
  document.documentElement.addEventListener("pointerleave", hideHalo);
  window.addEventListener("blur", hideHalo);
  reducedMotion.addEventListener("change", hideHalo);
  mouse.addEventListener("change", hideHalo);
})();
