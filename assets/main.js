/* Dr. Guillermo Coayla — interacciones y animaciones compartidas */
(() => {
  const WA_NUMBER = "51945798214";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // ---- Enlaces de WhatsApp con mensaje precargado: <a data-wa="texto">
  $$("[data-wa]").forEach(a => {
    const msg = a.dataset.wa || "Hola Dr. Coayla, quisiera agendar una consulta.";
    a.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    a.target = "_blank";
    a.rel = "noopener";
  });

  // ---- Header + barra de progreso + línea de timeline
  const header = $(".header");
  const bar = $(".scroll-progress");
  const tlLine = $(".timeline__line span");
  const timeline = $(".timeline");
  const onScroll = () => {
    const y = window.scrollY;
    header && header.classList.toggle("is-scrolled", y > 40);
    if (bar) {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    }
    if (tlLine && timeline) {
      const r = timeline.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * .7 - r.top) / r.height));
      tlLine.style.height = `${p * 100}%`;
    }
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- Menú móvil
  const toggle = $(".nav-toggle");
  toggle && toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open);
  });
  $$(".nav a").forEach(a => a.addEventListener("click", () => document.body.classList.remove("nav-open")));

  // ---- Reveal on scroll (+ escalonado con data-delay)
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.style.transitionDelay = `${el.dataset.delay || 0}ms`;
      el.classList.add("is-visible");
      io.unobserve(el);
    });
  }, { threshold: .15, rootMargin: "0px 0px -40px 0px" });
  $$("[data-reveal], .stat").forEach(el => io.observe(el));

  // ---- Contadores animados: <strong data-count="20" data-suffix="+">
  const countIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count, suffix = el.dataset.suffix || "", prefix = el.dataset.prefix || "";
      countIO.unobserve(el);
      if (reduceMotion) { el.textContent = prefix + end + suffix; return; }
      const t0 = performance.now(), dur = 1800;
      const tick = now => {
        const p = Math.min(1, (now - t0) / dur), eased = 1 - Math.pow(1 - p, 4);
        el.textContent = prefix + Math.round(end * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: .6 });
  $$("[data-count]").forEach(el => countIO.observe(el));

  // ---- Palabras rotativas en el hero
  $$(".rotator").forEach(rot => {
    const words = $$("span", rot);
    if (words.length < 2) return;
    let i = 0;
    words[0].classList.add("is-active");
    if (reduceMotion) return;
    setInterval(() => {
      const cur = words[i];
      cur.classList.remove("is-active"); cur.classList.add("is-leaving");
      setTimeout(() => cur.classList.remove("is-leaving"), 600);
      i = (i + 1) % words.length;
      words[i].classList.add("is-active");
    }, 2400);
  });

  // ---- Tarjetas con inclinación 3D + brillo que sigue al mouse
  if (!reduceMotion && matchMedia("(hover: hover)").matches) {
    $$("[data-tilt]").forEach(card => {
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.transform = `perspective(900px) rotateY(${(x - .5) * 10}deg) rotateX(${(.5 - y) * 10}deg) translateY(-6px)`;
        card.style.setProperty("--mx", `${x * 100}%`);
        card.style.setProperty("--my", `${y * 100}%`);
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });

    // Botones magnéticos
    $$("[data-magnetic]").forEach(btn => {
      btn.addEventListener("mousemove", e => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
    });

    // Halo que sigue al cursor
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);
    let gx = 0, gy = 0, tx = 0, ty = 0;
    addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function loop() {
      gx += (tx - gx) * .12; gy += (ty - gy) * .12;
      glow.style.transform = `translate(${gx - 190}px, ${gy - 190}px)`;
      requestAnimationFrame(loop);
    })();

    // Parallax suave del visual del hero
    const visual = $(".hero__visual");
    visual && addEventListener("mousemove", e => {
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      visual.style.transform = `translate(${x * -18}px, ${y * -18}px)`;
    }, { passive: true });
  }

  // ---- Partículas del hero (red de nodos tipo "conductos")
  const canvas = $("#particles");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let w, h, pts;
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(70, Math.floor(w * h / 18000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }));
    };
    resize(); addEventListener("resize", resize);
    let visible = true;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
    (function draw() {
      requestAnimationFrame(draw);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.fillStyle = "rgba(168,213,247,.7)";
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2); ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) {
          ctx.strokeStyle = `rgba(168,213,247,${.18 * (1 - d / 130)})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    })();
  }

  // ---- Carrusel de testimonios
  const track = $(".testis");
  $$(".testis-nav button").forEach(b => b.addEventListener("click", () => {
    if (!track) return;
    const card = $(".testi", track);
    const step = card ? card.offsetWidth + 24 : 400;
    track.scrollBy({ left: b.dataset.dir === "next" ? step : -step, behavior: "smooth" });
  }));

  // ---- Quiz de orientación (embudo): data-next="id" o data-result="clave"
  const quiz = $(".quiz");
  if (quiz) {
    const steps = $$(".quiz__step", quiz);
    const prog = $(".quiz__progress span", quiz);
    const total = steps.filter(s => !s.classList.contains("quiz__result")).length;
    let depth = 0;
    const show = id => {
      steps.forEach(s => s.classList.toggle("is-active", s.id === id));
      const isResult = $("#" + id).classList.contains("quiz__result");
      prog.style.width = isResult ? "100%" : `${(depth / total) * 100}%`;
    };
    quiz.addEventListener("click", e => {
      const opt = e.target.closest(".quiz__opt");
      if (opt) { depth++; show(opt.dataset.next); }
      if (e.target.closest("[data-restart]")) { depth = 0; show(steps[0].id); }
    });
  }

  // ---- Pestañas "Conozca su enfermedad"
  $$('[role="tablist"]').forEach(list => {
    const tabs = $$('[role="tab"]', list);
    const select = (tab, focus) => {
      tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute("aria-selected", on);
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(t));
      t.addEventListener("keydown", e => {
        const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (d) { e.preventDefault(); select(tabs[(i + d + tabs.length) % tabs.length], true); }
      });
    });
    select(tabs.find(t => t.getAttribute("aria-selected") === "true") || tabs[0]);
  });

  // ---- Fallback de foto: si no existe la imagen, se muestra el monograma
  $$("img[data-fallback]").forEach(img => {
    const hide = () => { img.style.display = "none"; };
    if (img.complete && img.naturalWidth === 0) hide();
    img.addEventListener("error", hide);
  });

  // ---- Año en footer
  $$("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });
})();
